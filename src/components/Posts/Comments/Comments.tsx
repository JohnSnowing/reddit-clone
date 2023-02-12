import {
    Box,
    Flex,
    SkeletonCircle,
    SkeletonText,
    Stack,
    Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtoms";
import { Post, postState } from "../../../atoms/postsAtom";
import CommentInput from "./CommentInput";
import CommentItem, { Comment } from "./CommentItem";

type CommentsProps = {
    user?: User | null;
    selectedPost: Post;
    community: string;
};

const Comments: React.FC<CommentsProps> = ({
    user,
    selectedPost,
    community,
}) => {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentFetchLoading, setCommentFetchLoading] = useState(false);
    const [commentCreateLoading, setCommentCreateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState("");
    const setAuthModalState = useSetRecoilState(authModalState);
    const setPostState = useSetRecoilState(postState);

    const onCreateComment = async () => {};

    const onDeleteComment = async () => {};

    const getPostComments = async () => {};

    useEffect(() => {
        getPostComments();
    }, []);

    return (
        <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
            <Flex
                direction="column"
                pl={10}
                pr={4}
                mb={6}
                fontSize="10pt"
                width="100%"
            >
                <CommentInput
                    comment=""
                    setComment={setComment}
                    loading={commentCreateLoading}
                    user={user}
                    onCreateComment={onCreateComment}
                />
            </Flex>
            <Stack spacing={6} p={2}>
                {commentFetchLoading ? (
                    <>
                        {[0, 1, 2].map((item) => (
                            <Box key={item} padding="6" bg="white">
                                <SkeletonCircle size="10" />
                                <SkeletonText
                                    mt="4"
                                    noOfLines={2}
                                    spacing="4"
                                />
                            </Box>
                        ))}
                    </>
                ) : (
                    <>
                        {!!comments.length ? (
                            <>
                                {comments.map((item: Comment) => (
                                    <CommentItem
                                        key={item.id}
                                        comment={item}
                                        onDeleteComment={onDeleteComment}
                                        isLoading={
                                            deleteLoading ===
                                            (item.id as string)
                                        }
                                        userId={user?.uid}
                                    />
                                ))}
                            </>
                        ) : (
                            <Flex
                                direction="column"
                                justify="center"
                                align="center"
                                borderTop="1px solid"
                                borderColor="gray.100"
                                p={20}
                            >
                                <Text fontWeight={700} opacity={0.3}>
                                    No Comment Yet
                                </Text>
                            </Flex>
                        )}
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default Comments;
