import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../atoms/authModalAtoms";
import { Community, communityState } from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";

const useCommunityData = (ssrCommunityData?: boolean) => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [communityStateValue, setCommunityStateValue] =
        useRecoilState(communityState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // useEffect(() => {
    //     if (!user || !!communityStateValue.mySnippets.length) return;
    //     getMySni
    // }, [user]);

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
        }

        setLoading(true);
    };

    return {
        communityStateValue,
        onJoinLeaveCommunity,
        loading,
        setLoading,
        error,
    };
};
export default useCommunityData;
