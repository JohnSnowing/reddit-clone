import { collection, doc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtoms";
import { Community, communityState } from "../atoms/communitiesAtom";
import { Post, postState, PostVote } from "../atoms/postsAtom";
import { auth, firestore } from "../firebase/clientApp";

const usePosts = (communityData?: Community) => {
    const [user, loadingUser] = useAuthState(auth);
    const [postsStateValue, setPostStateValue] = useRecoilState(postState);
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
        event: React.MouseEvent<SVGAElement, MouseEvent>,
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
        const existingVote = postsStateValue.postVotes.find(
            (vote) => vote.postId === post.id,
        );

        try {
            let voteChange = vote;
            const batch = writeBatch(firestore);

            const updatedPost = { ...post };
            const updatedPosts = [...postsStateValue.posts];
            let updatedPostVotes = [...postsStateValue.postVotes];

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
                    `${user.uid}/postVotes${existingVote.id}`,
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
                    const voteIdx = postsStateValue.postVotes.findIndex(
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
                ...postsStateValue,
                postVotes: updatedPostVotes,
            };

            const postIdx = postsStateValue.posts.findIndex(
                (item) => item.id === post.id,
            );
        } catch (error) {
            console.log("erorr", error);
        }
    };
    return {};
};
export default usePosts;
