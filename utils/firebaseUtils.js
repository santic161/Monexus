import { collection, addDoc, query, where, getDocs, getDoc, doc, updateDoc, arrayUnion, serverTimestamp, writeBatch, } from 'firebase/firestore';
import { db, storage } from '../firebase/firebaseConfig';
import * as Contacts from 'expo-contacts';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

// Fetch user balances
export const fetchUserBalances = async (userId) => {
  const balancesRef = collection(db, 'users', userId, 'balances');
  const querySnapshot = await getDocs(balancesRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Fetch friends
export const fetchFriends = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const friendIds = userDoc.data().friends || [];

  if (friendIds.length === 0) return [];

  const friendsRef = collection(db, 'users');
  const q = query(friendsRef, where('__name__', 'in', friendIds));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add a friend
export const addFriend = async (userId, friendEmail) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', friendEmail));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('User not found');
  }

  const friendDoc = querySnapshot.docs[0];
  const friendId = friendDoc.id;

  const batch = writeBatch(db);

  const userRef = doc(db, 'users', userId);
  batch.update(userRef, { friends: arrayUnion(friendId) });

  const friendRef = doc(db, 'users', friendId);
  batch.update(friendRef, { friends: arrayUnion(userId) });

  await batch.commit();
};

// Fetch user activities
export const fetchUserActivities = async (userId) => {
  const activitiesRef = collection(db, 'users', userId, 'activities');
  const querySnapshot = await getDocs(activitiesRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add an expense
export const addExpense = async (expenseData) => {
  const { createdBy, amount, description, participants, divisionType, groupId } = expenseData;

  const expenseRef = await addDoc(collection(db, 'expenses'), {
    createdBy,
    amount,
    description,
    participants,
    divisionType,
    groupId,
    createdAt: serverTimestamp(),
  });

  const batch = writeBatch(db);

  // Add activity for the expense creator
  const creatorActivityRef = doc(collection(db, 'users', createdBy, 'activities'));
  batch.set(creatorActivityRef, {
    description: `Added expense: ${description}`,
    amount,
    date: serverTimestamp(),
  });

  // Update balances for all participants
  participants.forEach(participant => {
    const balanceRef = doc(collection(db, 'users', participant.userId, 'balances'), createdBy);
    batch.set(balanceRef, { amount: participant.contribution }, { merge: true });
  });

  await batch.commit();

  return expenseRef.id;
};

export const uploadImage = async (uri, path, name = null, onProgress) => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();
  const filename = name || uri.substring(uri.lastIndexOf('/') + 1);

  const imageRef = ref(getStorage(), `${path}/${filename}`);

  const uploadTask = uploadBytesResumable(imageRef, theBlob);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
        reject(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          downloadUrl,
          metadata: uploadTask.snapshot.metadata,
        });
      }
    );
  });
};

// Fetch contacts
export const fetchContacts = async (userId) => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Contacts permission not granted');
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
    });

    if (!data || data.length === 0) {
      return [];
    }

    const contacts = data
      .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
      .map(contact => ({
        id: contact.id,
        name: contact.name || 'Unknown',
        phoneNumber: contact.phoneNumbers[0].number,
        image: contact.imageAvailable ? contact.image.uri : 'https://via.placeholder.com/100',
      }));

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return contacts;
    }

    const friendIds = userDoc.data().friends || [];

    if (friendIds.length === 0) {
      return contacts.map(contact => ({ ...contact, hasApp: false }));
    }

    const friendsRef = collection(db, 'users');
    const q = query(friendsRef, where('__name__', 'in', friendIds));
    const friendDocs = await getDocs(q);

    const friendPhoneNumbers = friendDocs.docs.map(doc => doc.data().phoneNumber);

    return contacts.map(contact => ({
      ...contact,
      hasApp: friendPhoneNumbers.includes(contact.phoneNumber)
    }));
  } catch (error) {
    console.error('Error in fetchContacts:', error);
    return [];
  }
};

// Fetch groups
export const fetchGroups = async (userId) => {
  const groupsRef = collection(db, 'groups');
  const q = query(groupsRef, where('members', 'array-contains', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Create a group
export const createGroup = async (groupData) => {
  const { name, members, createdBy, image } = groupData;
  const groupRef = await addDoc(collection(db, 'groups'), {
    name,
    members,
    createdBy,
    createdAt: serverTimestamp(),
    image
  });
  return groupRef.id;
};

// Fetch group members
export const fetchGroupMembers = async (groupId) => {
  const groupRef = doc(db, 'groups', groupId);
  const groupDoc = await getDoc(groupRef);

  if (!groupDoc.exists()) {
    throw new Error('Group not found');
  }

  const memberIds = groupDoc.data().members || [];

  if (memberIds.length === 0) return [];

  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('__name__', 'in', memberIds));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    email: doc.data().email,
    image: doc.data().image || 'https://via.placeholder.com/100',
  }));
};

// Check if a user exists
export const checkUserExists = async (phoneNumber) => {
  const q = query(collection(db, 'users'), where('phoneNumber', '==', phoneNumber));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Invite a contact to the app
export const inviteContact = async (contact) => {
  // Implement your invitation logic here (e.g., send SMS or email)
  console.log(`Inviting ${contact.name} to join Monexus`);
};

// Split expense equally
export const splitExpenseEqually = (amount, participants) => {
  const share = amount / participants.length;
  return participants.map(userId => ({ userId, contribution: share }));
};

// Split expense unequally by amount
export const splitExpenseUnequallyByAmount = (amount, contributions) => {
  return Object.entries(contributions).map(([userId, contribution]) => ({ userId, contribution }));
};

// Split expense unequally by percentage
export const splitExpenseUnequallyByPercentage = (amount, percentages) => {
  return Object.entries(percentages).map(([userId, percentage]) => ({
    userId,
    contribution: (amount * percentage) / 100
  }));
};