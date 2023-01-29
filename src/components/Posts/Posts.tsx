import { Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Community } from "../../atoms/communitiesAtom";
import { Post } from "../../atoms/postsAtom";
import { firestore } from "../../firebase/clientApp";
import usePosts from "../../hooks/usePosts";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type PostsProps = {
    communityData?: Community;
    userId?: string;
    loadingUser: boolean;
};

const Posts: React.FC<PostsProps> = ({
    communityData,
    userId,
    loadingUser,
}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { postStateValue, setPostStateValue, onVote, onDeletePost } =
        usePosts(communityData!);

    const onSelectPost = (post: Post, postIdx: number) => {
        setPostStateValue((prev) => ({
            ...prev,
            selectedPost: { ...post, postIdx },
        }));

        router.push(`/r/${communityData?.id}/comments/${post.id}`);
    };

    useEffect(() => {
        if (
            postStateValue.postsCache[communityData?.id!] &&
            !postStateValue.postUpdateRequired
        ) {
            setPostStateValue((prev) => ({
                ...prev,
                posts: postStateValue.postsCache[communityData?.id!],
            }));
            return;
        }

        getPosts();
    }, [communityData, postStateValue.postUpdateRequired]);

    const getPosts = async () => {
        setLoading(true);

        try {
            const postsQuery = query(
                collection(firestore, "posts"),
                where("communityId", "==", communityData?.id!),
                orderBy("createdAt", "desc"),
            );

            const postDocs = await getDocs(postsQuery);
            const posts = postDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
                postsCache: {
                    ...prev.postsCache,
                    [communityData?.id!]: posts as Post[],
                },
                postUpdateRequired: false,
            }));
        } catch (err: any) {
            console.log("error", err.message);
        }
        setLoading(false);
    };

    // const { postStateValue, setPostStateValue, onVote, onDeletePost } = usePost
    return (
        <>
            {loading ? (
                <PostLoader />
            ) : (
                <Stack>
                    {postStateValue.posts.map((post: Post, index) => (
                        <PostItem
                            key={post.id}
                            post={post}
                            onVote={onVote}
                            onDeletePost={onDeletePost}
                            userVoteValue={
                                postStateValue.postVotes.find(
                                    (item) => item.postId === post.id,
                                )?.voteValue
                            }
                            userIsCreator={userId === post.creatorId}
                            onSelectPost={onSelectPost}
                        />
                    ))}
                </Stack>
            )}
        </>
    );
};
export default Posts;
