import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { auth, firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import { Community } from "../../../atoms/communitiesAtom";
import CommunityNotFound from "../../../components/Community/CommunityNotFound";
import Header from "../../../components/Community/Header";
import PageContentLayout from "../../../components/Layout/PageContent";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Posts from "../../../components/Posts/Posts";
import { useAuthState } from "react-firebase-hooks/auth";

type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
    const [user, loadingUser] = useAuthState(auth);
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
                <></>
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
