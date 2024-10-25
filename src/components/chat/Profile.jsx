import { Avatar, Typography, Space, Card, Divider, Flex, Button, Image } from "antd";
import {
    FileTextOutlined,
    VideoCameraOutlined,
    PictureOutlined,
    FileOutlined,
    LinkOutlined,
    ArrowRightOutlined,
    RightOutlined,
    LeftOutlined
} from "@ant-design/icons";
import { useChat } from "@/context/ChatContext";
import { useState } from "react";

const { Title, Text } = Typography;

export default function Profile({ toggleProfile }) {
    const { messages, chatData } = useChat();

    // Mock data for user
    const user = {
        name: "Real Estate Deals",
        email: "real.estate@example.com",
        membersCount: 10,
        photoURL: "https://randomuser.me/api/portraits/men/23.jpg", // Replace with actual user photo URL
    };

    const sharedFiles = {
        allFiles: 231,
        allLinks: 45,
        fileTypes: [
            {
                type: "Documents",
                count: 126,
                totalSize: "193MB",
                icon: <FileTextOutlined className="text-lg text-gray-600 bg-blue-300 rounded-lg p-2 w-8 h-8" />,
            },
            {
                type: "Photos",
                count: 53,
                totalSize: "321MB",
                icon: <PictureOutlined className="text-lg text-gray-600 bg-yellow-100 rounded-lg p-2 w-8 h-8" />,
            },
            {
                type: "Videos",
                count: 3,
                totalSize: "210MB",
                icon: <VideoCameraOutlined className="text-lg text-gray-600 bg-green-100 rounded-lg p-2 w-8 h-8" />,
            },
            {
                type: "Other",
                count: 49,
                totalSize: "194MB",
                icon: <FileOutlined className="text-lg text-gray-600 bg-red-100 rounded-lg p-2 w-8 h-8" />,
            },
        ],
    };

    // State to manage visibility of file types and images
    const [showImages, setShowImages] = useState(false);

    // Function to extract image URLs from messages
    const getImageUrlsFromMessages = (messages) => {
        return messages
            .filter((msg) => msg.img) // Filter messages that have an image property
            .map((msg) => msg.img); // Extract image URLs
    };

    // Extracting images from chatData
    const imageUrls = getImageUrlsFromMessages(messages || []);

    return (
        <Flex vertical className="p-4 w-full h-full md:dark:border-l-2 drop-shadow-md dark:border-gray-600 bg-white dark:bg-transparent overflow-y-scroll hide-scrollbar">
            {/* User Details */}
            <Flex gap={8} align="center" className="p-2 bg-none mb-4 border-b-2 border-b-blue-200 dark:border-b-gray-600">
                <Button
                    type="text"
                    className="text-gray-600 bg-blue-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-500 rounded-lg drop-shadow-sm outline-none"
                    onClick={toggleProfile}
                    iconPosition="end"
                    icon={<RightOutlined />}
                />
                <Text level={5} className="text-blue-500 font-semibold text-base">Profile details</Text>
            </Flex>
            <Card className="w-full drop-shadow-md mb-4 bg-blue-50 dark:bg-gray-800 border-none">
                <Flex vertical justify="center" align="center">
                    <Avatar size={64} src={chatData?.user.photoURL} />
                    <Flex vertical className="ml-4">
                        <Text level={5} className="secondary capitalize font-semibold text-lg mb-0 text-center text-blue-500 dark:text-blue-500">
                            {chatData?.user.displayName}
                        </Text>
                        <Text className="secondary text-center text-gray-400 dark:text-gray-500">{user.membersCount} members</Text>
                    </Flex>
                </Flex>
            </Card>

            {/* Shared Files Summary */}
            <Card className="w-full drop-shadow-md mb-4 border-none bg-blue-50 dark:bg-gray-800 dark:text-blue-500">
                <Flex justify="space-between">
                    <Flex align="center">
                        <FileTextOutlined className="mr-2 text-lg text-blue-500" />
                        <Text className="text-gray-600 dark:text-gray-100">All Files: {sharedFiles.allFiles}</Text>
                    </Flex>
                    <Flex align="center">
                        <LinkOutlined className="mr-2 text-lg text-blue-500" />
                        <Text className="text-gray-600 dark:text-gray-100">All Links: {sharedFiles.allLinks}</Text>
                    </Flex>
                </Flex>
            </Card>

            {/* File Types List */}
            {!showImages ? (
                <Flex vertical className="w-full drop-shadow-md bg-blue-50 dark:bg-gray-800 rounded-lg p-4">
                    {sharedFiles.fileTypes.map((fileType) => (
                        <Flex
                            align="center"
                            key={fileType.type}
                            gap={8}
                            className="p-2 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 select-none"
                            onClick={() => {
                                if (fileType.type === "Photos") {
                                    setShowImages(true); // Show images when "Photos" is clicked
                                }
                            }}
                        >
                            <Flex align="center" bg-blue-100 rounded-lg>
                                {fileType.icon}
                            </Flex>
                            <Flex vertical gap={2}>
                                <Text className="text-base dark:text-gray-100">{fileType.type}</Text>
                                <Text className="text-xs dark:text-gray-400">{fileType.count} files, {fileType.totalSize}</Text>
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            ) : (
                // Render Shared Images
                <Flex vertical className="w-full drop-shadow-md bg-blue-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-900">
                    <Flex align="center" className="flex mb-2 items-center justify-between">
                        <Text className="text-base dark:text-gray-50 text-gray-500 mb-2">Shared Images</Text>
                        <Button
                            type="text"
                            iconPosition="end"
                            onClick={() => setShowImages(false)}
                            icon={<RightOutlined />}
                            className="text-blue-500 hover:text-blue-300"
                        >
                            Back
                        </Button>
                    </Flex>
                    {imageUrls.length > 0 ? (
                        <Flex wrap justify="space-around" gap={8}>
                            {imageUrls.map((url, index) => (
                                <Image key={index} width={100} height={100} src={url} alt={`Shared Image ${index}`} className="p-2 bg-gray-500 overflow-hidden object-cover rounded-lg" />
                            ))}
                        </Flex>
                    ) : (
                        <Text className="text-center text-gray-500 dark:text-gray-400">No images available</Text>
                    )}
                </Flex>
            )}
        </Flex>
    );
}
