import React, { useState } from 'react';
import { collection, getDocs, query, serverTimestamp, setDoc, updateDoc, where, doc, getDoc } from 'firebase/firestore';
import { Avatar, Typography, Input, Flex } from 'antd';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/firebaseConfig';

const { Search } = Input;
const { Text } = Typography;

const Searchbar = () => {
    const { currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);

    // Handle search based on input term
    const handleSearch = async () => {
        if (searchTerm.trim() === '') return;

        const q = query(
            collection(db, 'Users'),
            where("name", ">=", searchTerm),
            where("name", "<=", searchTerm + "\uf8ff")
        );

        try {
            const querySnapshot = await getDocs(q);
            const matchedUsers = [];
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.uid !== currentUser.uid) {
                    matchedUsers.push(userData);
                }
            });

            setUsers(matchedUsers.length > 0 ? matchedUsers : []);
            setError(matchedUsers.length === 0);
        } catch (err) {
            console.error(err);
            setError(true);
        }
    };

    const handleSelect = async (selectedUser) => {
        const combinedId = currentUser.uid > selectedUser.uid
            ? currentUser.uid + selectedUser.uid
            : selectedUser.uid + currentUser.uid;

        try {
            const res = await getDoc(doc(db, "Chats", combinedId));

            if (!res.exists()) {
                // Create a new chat if it doesn't exist
                await setDoc(doc(db, "Chats", combinedId), { messages: [] });
            }

            // Update current user's chat info
            await updateDoc(doc(db, "UserChats", currentUser.uid), {
                [`${combinedId}.user`]: {
                    uid: selectedUser.uid,
                    displayName: selectedUser.name,
                    photoURL: selectedUser.photoURL,
                },
                [`${combinedId}.date`]: serverTimestamp(),
            });

            // Update selected user's chat info
            await updateDoc(doc(db, "UserChats", selectedUser.uid), {
                [`${combinedId}.user`]: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL,
                },
                [`${combinedId}.date`]: serverTimestamp(),
            });

        } catch (error) {
            console.error(error);
            setError(true);
        }

        setUsers([]);
        setSearchTerm('');
    };

    return (
        <Flex vertical className="relative w-full px-4 pt-4 space-y-2 bg-white dark:bg-transparent">
            <Search
                placeholder="input search text"
                onSearch={handleSearch}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    if (value === '') {
                        setUsers([]);
                    }
                }}
                size='large'
            />

            {/* Search Results */}
            {searchTerm && users && (
                <Flex vertical className="top-full left-0 bg-gray-100 dark:bg-gray-800 shadow-md rounded-md mt-2 z-20 md:mr-0 w-full transition-all duration-500 overflow-hidden">
                    {users.length > 0 ? (
                        <Flex vertical className="gap-2 p-2">
                            <h1 className="text-gray-700 dark:text-gray-500 text-center">Users found</h1>
                            {users.map((user) => (
                                <Flex
                                    horizontal
                                    align="center"
                                    onClick={() => handleSelect(user)}
                                    key={user.uid}
                                    className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:dark:bg-gray-600 cursor-pointer"
                                >
                                    <Avatar src={user.photoURL} size={40} />
                                    <Flex vertical className="ml-3">
                                        <Text strong className="text-blue-500 dark:text-gray-300 capitalize">
                                            {user.name}
                                        </Text>
                                    </Flex>
                                </Flex>
                            ))}
                        </Flex>
                    ) : (
                        <Flex horizontal justify="center" className="p-3 text-gray-500">No users found</Flex>
                    )}
                </Flex>
            )}
        </Flex>
    );
};

export default Searchbar;
