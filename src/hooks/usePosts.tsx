import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtoms";
import { Community, communityState } from "../atoms/communitiesAtom";
import { Post, postState, PostVote } from "../atoms/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";

const usePosts = (communityData?: Community) => {
    const [user, loadingUser] = useAuthState(auth);
    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const communityStateValue = useRecoilValue(communityState);

    const onSelectPost = (post: Post, postIdx: number) => {
        setPostStateValue((prev) => ({
            ...prev,
            selectedPost: { ...post, postIdx },
        }));

        router.push(`/r/${post.communityId}/comments/${post.id}`);
    };

    const onVote = async (
        event: React.MouseEvent<SVGElement, MouseEvent>,
        post: Post,
        vote: number,
        communityId: string,
    ) => {
        event.stopPropagation();
        if (!user?.uid) {
            setAuthModalState({ open: true, view: "login" });
            return;
        }

        const { voteStatus } = post;
        const existingVote = postStateValue.postVotes.find(
            (vote) => vote.postId === post.id,
        );

        try {
            let voteChange = vote;
            const batch = writeBatch(firestore);

            const updatedPost = { ...post };
            const updatedPosts = [...postStateValue.posts];
            let updatedPostVotes = [...postStateValue.postVotes];

            if (!existingVote) {
                const postVoteRef = doc(
                    collection(firestore, "users", `${user.uid}/postVotes`),
                );

                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id,
                    communityId,
                    voteValue: vote,
                };

                batch.set(postVoteRef, newVote);

                updatedPost.voteStatus = voteStatus + vote;
                updatedPostVotes = [...updatedPostVotes, newVote];
            } else {
                const postVoteRef = doc(
                    firestore,
                    "users",
                    `${user.uid}/postVotes/${existingVote.id}`,
                );

                //remove vote
                if (existingVote.voteValue === vote) {
                    voteChange *= -1;
                    updatedPost.voteStatus = voteStatus - vote;
                    updatedPostVotes = updatedPostVotes.filter(
                        (vote) => vote.id !== existingVote.id,
                    );
                    batch.delete(postVoteRef);
                } else {
                    voteChange = 2 * vote;
                    updatedPost.voteStatus = voteStatus + 2 * vote;
                    const voteIdx = postStateValue.postVotes.findIndex(
                        (vote) => vote.id === existingVote.id,
                    );

                    if (voteIdx !== -1) {
                        updatedPostVotes[voteIdx] = {
                            ...existingVote,
                            voteValue: vote,
                        };
                    }

                    batch.update(postVoteRef, { voteValue: vote });
                }
            }

            let updatedState = {
                ...postStateValue,
                postVotes: updatedPostVotes,
            };

            const postIdx = postStateValue.posts.findIndex(
                (item) => item.id === post.id,
            );

            updatedPosts[postIdx!] = updatedPost;
            updatedState = {
                ...updatedState,
                posts: updatedPosts,
                postsCache: {
                    ...updatedState.postsCache,
                    [communityId]: updatedPosts,
                },
            };

            if (updatedState.selectedPost) {
                updatedState = {
                    ...updatedState,
                    selectedPost: updatedPost,
                };
            }

            setPostStateValue(updatedState);

            const postRef = doc(firestore, "posts", post.id);
            batch.update(postRef, { voteStatus: voteStatus + voteChange });
            await batch.commit();
        } catch (error) {
            console.log("erorr", error);
        }
    };

    const onDeletePost = async (post: Post): Promise<boolean> => {
        console.log("Deleting post", post.id);
        try {
            if (post.imageUrl) {
                const imageRef = ref(storage, `posts/${post.id}/image`);
                await deleteObject(imageRef);
            }

            const postDocRef = doc(firestore, "posts", post.id);
            await deleteDoc(postDocRef);

            setPostStateValue((prev) => ({
                ...prev,
                posts: prev.posts.filter((item) => item.id !== post.id),
                postsCache: {
                    ...prev.postsCache,
                    [post.communityId]: prev.postsCache[
                        post.communityId
                    ]?.filter((item) => item.id !== post.id),
                },
            }));

            return true;
        } catch (error) {
            console.log("delete error", error);
            return false;
        }
    };

    const getCommunityPostVotes = async (communityId: string) => {
        const postVotesQuery = query(
            collection(firestore, `users/${user?.uid}/postVotes`),
            where("communityId", "==", communityId),
        );

        const postVoteDocs = await getDocs(postVotesQuery);
        const postVotes = postVoteDocs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setPostStateValue((prev) => ({
            ...prev,
            postVotes: postVotes as PostVote[],
        }));
    };

    useEffect(() => {
        if (!user?.uid || !communityStateValue.currentCommunity) return;
        getCommunityPostVotes(communityStateValue.currentCommunity.id);
    }, [user, communityStateValue.currentCommunity]);

    useEffect(() => {
        if (!user?.uid && !loadingUser) {
            setPostStateValue((prev) => ({
                ...prev,
                postVotes: [],
            }));
            return;
        }
    }, [user, loadingUser]);

    return {
        postStateValue,
        setPostStateValue,
        onSelectPost,
        onDeletePost,
        loading,
        setLoading,
        onVote,
        error,
    };
};
export default usePosts;
