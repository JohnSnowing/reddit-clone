import { Box, Flex, Icon } from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { FaReddit } from "react-icons/fa";

export type Comment = {
    id?: string;
    creatorId: string;
    creatorDisplayText: string;
    creatorPhotoUrl: string;
    communityId: string;
    postId: string;
    postTitle: string;
    text: string;
    createdAt?: Timestamp;
};

type CommentItemProps = {
    comment: Comment;
    onDeleteComment: (comment: Comment) => void;
    isLoading: boolean;
    userId?: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    onDeleteComment,
    isLoading,
    userId,
}) => {
    return (
        <Flex>
            <Box mr={2}>
                <Icon as={FaReddit} fontSize={30} color="gray.300" />
            </Box>
        </Flex>
    );
};

export default CommentItem;
