import { doc, getDoc, increment, writeBatch } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtoms";
import {
    Community,
    CommunitySnippet,
    communityState,
    defaultCommunity,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";
import { getMySnippets } from "../helpers/firestore";

const useCommunityData = (ssrCommunityData?: boolean) => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [communityStateValue, setCommunityStateValue] =
        useRecoilState(communityState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user || !!communityStateValue.mySnippets.length) return;

        getSnippets();
    }, [user]);

    const getSnippets = async () => {
        setLoading(true);

        try {
            const snippets = await getMySnippets(user?.uid!);
            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
                initSnippetsFetched: true,
            }));
            setLoading(false);

            console.log("snipp", snippets);
        } catch (error: any) {
            console.log(error);
            setError(error.message);
        }
    };

    const getCommunityData = async (communityId: string) => {
        try {
            const communityDocRef = doc(
                firestore,
                "communities",
                communityId as string,
            );

            const communityDoc = await getDoc(communityDocRef);

            setCommunityStateValue((prev) => ({
                ...prev,
                currentCommunity: {
                    id: communityDoc.id,
                    ...communityDoc.data(),
                } as Community,
            }));
        } catch (error) {
            console.log(error);
        }

        setLoading(false);
    };

    const onJoinLeaveCommunity = (community: Community, isJoined?: boolean) => {
        if (!user) {
            setAuthModalState({ open: true, view: "login" });
            return;
        }

        setLoading(true);

        if (isJoined) {
            leaveCommunity(community.id);
            return;
        }
        joinCommunity(community);
    };

    const joinCommunity = async (community: Community) => {
        try {
            const batch = writeBatch(firestore);

            const newSnippet: CommunitySnippet = {
                communityId: community.id,
                imageUrl: community.imageUrl || "",
            };

            batch.set(
                doc(
                    firestore,
                    `users/${user?.uid}/communitySnippets`,
                    community.id,
                ),
                newSnippet,
            );

            batch.update(doc(firestore, "communities", community.id), {
                numberOfMembers: increment(1),
            });

            await batch.commit();

            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet],
            }));
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const leaveCommunity = async (communityId: string) => {
        try {
            const batch = writeBatch(firestore);

            batch.delete(
                doc(
                    firestore,
                    `users/${user?.uid}/communitySnippets/${communityId}`,
                ),
            );

            batch.update(doc(firestore, "communities", communityId), {
                numberOfMembers: increment(-1),
            });

            await batch.commit();

            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: prev.mySnippets.filter(
                    (item) => item.communityId !== communityId,
                ),
            }));
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const { community } = router.query;
        if (community) {
            const communityData = communityStateValue.currentCommunity;

            if (!communityData.id) {
                getCommunityData(community as string);
                return;
            }
        } else {
            setCommunityStateValue((prev) => ({
                ...prev,
                currentCommunity: defaultCommunity,
            }));
        }
    }, [router.query, communityStateValue.currentCommunity]);

    return {
        communityStateValue,
        onJoinLeaveCommunity,
        loading,
        setLoading,
        error,
    };
};
export default useCommunityData;
