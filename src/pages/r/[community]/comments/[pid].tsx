import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../../../atoms/postsAtom";
import { auth, firestore } from "../../../../firebase/clientApp";
import useCommunityData from "../../../../hooks/useCommunityData";
import usePosts from "../../../../hooks/usePosts";
import PageContentLayout from "../../../../components/Layout/PageContent";
import PostLoader from "../../../../components/Posts/PostLoader";
import PostItem from "../../../../components/Posts/PostItem";
import About from "../../../../components/Community/About";
import Comments from "../../../../components/Posts/Comments/Comments";

type PostPageProps = {};

const PostPage: React.FC<PostPageProps> = () => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const { commmunity, pid } = router.query;
    const { communityStateValue } = useCommunityData();

    const {
        postStateValue,
        setPostStateValue,
        onDeletePost,
        loading,
        setLoading,
        onVote,
    } = usePosts(communityStateValue.currentCommunity);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const postDocRef = doc(firestore, "posts", pid as string);
            const postDoc = await getDoc(postDocRef);
            setPostStateValue((prev) => ({
                ...prev,
                selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
            }));
        } catch (error: any) {
            console.log("fetchPost error", error.message);
        }
        setLoading(false);
    };

    // Fetch post if not in already in state
    useEffect(() => {
        const { pid } = router.query;

        if (pid && !postStateValue.selectedPost) {
            fetchPost();
        }
    }, [router.query, postStateValue.selectedPost]);

    return (
        <PageContentLayout>
            <>
                {loading ? (
                    <PostLoader />
                ) : (
                    <>
                        {postStateValue.selectedPost && (
                            <>
                                <PostItem
                                    post={postStateValue.selectedPost}
                                    onVote={onVote}
                                    onDeletePost={onDeletePost}
                                    userVoteValue={
                                        postStateValue.postVotes.find(
                                            (item) =>
                                                item.postId ===
                                                postStateValue.selectedPost!.id,
                                        )?.voteValue
                                    }
                                    userIsCreator={
                                        user?.uid ===
                                        postStateValue.selectedPost.creatorId
                                    }
                                    router={router}
                                />
                                <Comments
                                    user={user}
                                    community={commmunity as string}
                                    selectedPost={postStateValue.selectedPost}
                                />
                            </>
                        )}
                    </>
                )}
            </>
            <>
                <About
                    communityData={communityStateValue.currentCommunity}
                    loading={loading}
                />
            </>
        </PageContentLayout>
    );
};
export default PostPage;
