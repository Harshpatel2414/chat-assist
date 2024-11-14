import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Avatar, Typography, Input, Flex, Button } from 'antd';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/firebaseConfig';
import { PlusOutlined } from '@ant-design/icons';
import ChatService from '@/firebase/chat';

const { Search } = Input;
const { Text } = Typography;

const Searchbar = () => {
    const { currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);

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
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelect = async (selectedUser) => {
        try {
            await ChatService.addUser(selectedUser)
        } catch (error) {
            console.log(error);
        } finally {
            setSearchTerm('');
            setUsers([]);
        }
    };

    return (
        <Flex vertical className="relative w-full px-4 pt-4 space-y-2 bg-white dark:bg-transparent">
            <Search
                placeholder="input search text"
                onSearch={handleSearch}
                onChange={(e) => {
                    const value = e.target.value.toLowerCase();
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
                                    align="center"

                                    key={user.uid}
                                    className="p-2 bg-white dark:bg-gray-700 rounded-lg cursor-pointer"
                                >
                                    <Avatar src={user.photoURL} size={40} />
                                    <Flex vertical className="ml-3 flex-1">
                                        <Text strong className="text-gray-700 dark:text-gray-300 capitalize">
                                            {user.name}
                                        </Text>
                                    </Flex>
                                    <Button
                                        size='small'
                                        iconPosition='start'
                                        onClick={() => handleSelect(user)}
                                        icon={<PlusOutlined />}
                                        className='dark:text-blue-500  bg-blue-500 dark:bg-blue-700 text-xs text-white border-none'
                                    >
                                        Add
                                    </Button>
                                </Flex>
                            ))}
                        </Flex>
                    ) : (
                        <Flex justify="center" className="p-3 text-gray-500">No users found</Flex>
                    )}
                </Flex>
            )}
        </Flex>
    );
};

export default Searchbar;
