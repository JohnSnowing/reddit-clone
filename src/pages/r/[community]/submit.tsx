import { Box, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communitiesAtom";
import About from "../../../components/Community/About";
import PageContentLayout from "../../../components/Layout/PageContent";
import NewPostForm from "../../../components/Posts/PostForm/NewPostForm";
import { auth } from "../../../firebase/clientApp";
import useCommunityData from "../../../hooks/useCommunityData";

const CreateCommunityPostPage: NextPage = () => {
    const [user, loadingUser, error] = useAuthState(auth);
    const communityStateValue = useRecoilValue(communityState);
    const router = useRouter();

    const { loading } = useCommunityData();

    useEffect(() => {
        if (!user && !loadingUser && communityStateValue.currentCommunity.id) {
            router.push(`/r/${communityStateValue.currentCommunity.id}`);
        }
    }, [user, loadingUser, communityStateValue.currentCommunity]);

    return (
        <PageContentLayout maxWidth="1060px">
            <>
                <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
                    <Text fontWeight={600}>Create Post</Text>
                </Box>
                {user && (
                    <NewPostForm
                        communityId={communityStateValue.currentCommunity.id}
                        communityImageURL={
                            communityStateValue.currentCommunity.imageUrl
                        }
                        user={user}
                    />
                )}
            </>
            {communityStateValue.currentCommunity && (
                <>
                    <About
                        communityData={communityStateValue.currentCommunity}
                        pt={6}
                        onCreatePage
                        loading={loading}
                    />
                </>
            )}
        </PageContentLayout>
    );
};
export default CreateCommunityPostPage;
