import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Tag, notification, Typography, Flex } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import ChatService from '@/firebase/chat';

const TagModal = ({ chatId, visible, onClose, tags, setTags }) => {
  const [newTag, setNewTag] = useState(""); 
  const [selectedTags, setSelectedTags] = useState([]);

  const suggestedTags = ['Payment', 'Urgent', 'Follow Up', 'Support', 'Invoice', 'Reminder']; // Example suggested tags
  
  useEffect(()=>{
    if(tags){
      setSelectedTags(tags)
    }
  },[tags])
  const addTag = async () => {
    if (selectedTags.length === 0) return; 
    try {
      await ChatService.addTag(chatId, selectedTags);
      setTags(selectedTags); 
      onClose(); 
      notification.success({ message: 'Tags added successfully!' });
    } catch (error) {
      console.error("Error adding tags:", error);
      notification.error({ message: 'Failed to add tags' });
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags); 
  };

  const handleSuggestedTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Modal
      title="Manage Tags"
      open={visible}
      centered
      onCancel={onClose}
      onOk={addTag}
      okText="Add Tags"
      width={400}
      className='dark:bg-gray-700'
    >
      <Input
        placeholder="Enter tag"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)} 
        onPressEnter={() => {
          if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
            setSelectedTags([...selectedTags, newTag.trim()]);
            setNewTag(""); 
          }
        }}
      />
      
      <Flex vertical gap={10} className="mt-3">
        <Typography.Text className=' capitalize font-semibold'>suggested tags :</Typography.Text>
        <Flex  wrap gap={8}>
          {suggestedTags.map((suggestedTag, index) => (
            <Button
              key={index}
              size="small"
              onClick={() => handleSuggestedTagClick(suggestedTag)} 
              className='p-2'
              icon={<PlusOutlined />}
              iconPosition='end'
            >
              {suggestedTag}
            </Button>
          ))}
        </Flex>
      </Flex>

      <Flex vertical gap={10} className="mt-3">
      <Typography.Text className=' capitalize font-semibold '>current tags :</Typography.Text>
        <Flex >
          {selectedTags.map((tag, idx) => (
            <Tag
              key={idx}
              closable
              onClose={() => removeTag(tag)} 
              color="blue"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {tag}
            </Tag>
          ))}
        </Flex>
      </Flex>
    </Modal>
  );
};

export default TagModal;
