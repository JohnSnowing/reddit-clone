import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { auth, firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import { Community, communityState } from "../../../atoms/communitiesAtom";
import CommunityNotFound from "../../../components/Community/CommunityNotFound";
import Header from "../../../components/Community/Header";
import PageContentLayout from "../../../components/Layout/PageContent";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Posts from "../../../components/Posts/Posts";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import About from "../../../components/Community/About";

type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
    const [user, loadingUser] = useAuthState(auth);

    const [communityStateValue, setCommunityStateValue] =
        useRecoilState(communityState);

    useEffect(() => {
        setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: communityData,
        }));
    }, [communityData]);

    if (!communityData) {
        return <CommunityNotFound />;
    }

    return (
        <>
            <Header communityData={communityData} />

            <PageContentLayout>
                <>
                    <CreatePostLink />
                    <Posts
                        communityData={communityData}
                        userId={user?.uid}
                        loadingUser={loadingUser}
                    />
                </>
                <>
                    <About communityData={communityData} />
                </>
            </PageContentLayout>
        </>
    );
};
export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const communityDocRef = doc(
            firestore,
            "communities",
            context.query.community as string,
        );

        const communityDoc = await getDoc(communityDocRef);

        return {
            props: {
                communityData: communityDoc.exists()
                    ? JSON.parse(
                          safeJsonStringify({
                              id: communityDoc.id,
                              ...communityDoc.data(),
                          }),
                      )
                    : "",
            },
        };
    } catch (error) {
        console.log("getserversidepropserror", error);
    }
}
