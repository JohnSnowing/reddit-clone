import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React from "react";
import { firestore } from "../../../firebase/clientApp";
import safeJsonStringify from "safe-json-stringify";
import { Community } from "../../../atoms/communitiesAtom";
import CommunityNotFound from "../../../components/Community/CommunityNotFound";
import Header from "../../../components/Community/Header";

type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
    if (!communityData) {
        return <CommunityNotFound />;
    }

    return (
        <>
            <Header communityData={communityData} />
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
