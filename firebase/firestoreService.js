import { db, auth } from './firebaseConfig';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    onSnapshot
} from 'firebase/firestore';

const handleFirestoreError = (error, operation) => {
    console.error(`Error ${operation}:`, error);
    if (error.code === 'permission-denied') {
        console.error('Permission denied. Please check your authentication status and data access rights.');
    }
    throw error;
};

// User operations
export const createUser = async (userData) => {
    try {
        const docRef = await addDoc(collection(db, 'users'), userData);
        return docRef.id;
    } catch (error) {
        handleFirestoreError(error, 'creating user');
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, userData);
    } catch (error) {
        handleFirestoreError(error, 'updating user');
    }
};

export const getUser = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        } else {
            console.log('No such user!');
            return null;
        }
    } catch (error) {
        handleFirestoreError(error, 'getting user');
    }
};

// Group operations
export const createGroup = async (groupData) => {
    try {
        const docRef = await addDoc(collection(db, 'groups'), groupData);
        return docRef.id;
    } catch (error) {
        handleFirestoreError(error, 'creating group');
    }
};

export const updateGroup = async (groupId, groupData) => {
    try {
        const groupRef = doc(db, 'groups', groupId);
        await updateDoc(groupRef, groupData);
    } catch (error) {
        handleFirestoreError(error, 'updating group');
    }
};

export const getGroup = async (groupId) => {
    try {
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
            return { id: groupSnap.id, ...groupSnap.data() };
        } else {
            console.log('No such group!');
            return null;
        }
    } catch (error) {
        handleFirestoreError(error, 'getting group');
    }
};

export const getUserGroups = async (userId) => {
    try {
        const q = query(collection(db, 'groups'), where('members', 'array-contains', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        handleFirestoreError(error, 'getting user groups');
    }
};

// Expense operations
export const createExpense = async (expenseData) => {
    try {
        const docRef = await addDoc(collection(db, 'expenses'), expenseData);
        return docRef.id;
    } catch (error) {
        handleFirestoreError(error, 'creating expense');
    }
};

export const updateExpense = async (expenseId, expenseData) => {
    try {
        const expenseRef = doc(db, 'expenses', expenseId);
        await updateDoc(expenseRef, expenseData);
    } catch (error) {
        handleFirestoreError(error, 'updating expense');
    }
};

export const deleteExpense = async (expenseId) => {
    try {
        await deleteDoc(doc(db, 'expenses', expenseId));
    } catch (error) {
        handleFirestoreError(error, 'deleting expense');
    }
};

export const getGroupExpenses = async (groupId) => {
    try {
        const q = query(collection(db, 'expenses'), where('groupId', '==', groupId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        handleFirestoreError(error, 'getting group expenses');
    }
};

// Settlement operations
export const createSettlement = async (settlementData) => {
    try {
        const docRef = await addDoc(collection(db, 'settlements'), settlementData);
        return docRef.id;
    } catch (error) {
        handleFirestoreError(error, 'creating settlement');
    }
};

export const getGroupSettlements = async (groupId) => {
    try {
        const q = query(collection(db, 'settlements'), where('groupId', '==', groupId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        handleFirestoreError(error, 'getting group settlements');
    }
};

// Real-time listeners
export const subscribeToGroupExpenses = (groupId, callback) => {
    const q = query(collection(db, 'expenses'), where('groupId', '==', groupId));
    return onSnapshot(q,
        (querySnapshot) => {
            const expenses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(expenses);
        },
        (error) => {
            handleFirestoreError(error, 'subscribing to group expenses');
        }
    );
};

export const subscribeToUserGroups = (userId, callback) => {
    const q = query(collection(db, 'groups'), where('members', 'array-contains', userId));
    return onSnapshot(q,
        (querySnapshot) => {
            const groups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(groups);
        },
        (error) => {
            handleFirestoreError(error, 'subscribing to user groups');
        }
    );
};