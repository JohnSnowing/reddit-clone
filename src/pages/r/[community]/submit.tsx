import { Box, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";
import { communityState } from "../../../atoms/communitiesAtom";
import PageContentLayout from "../../../components/Layout/PageContent";
import NewPostForm from "../../../components/Posts/PostForm/NewPostForm";
import { auth } from "../../../firebase/clientApp";

const CreateCommunityPostPage: NextPage = () => {
    const [user, loadingUser, error] = useAuthState(auth);
    const communityStateValue = useRecoilValue(communityState);
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
                {communityStateValue.currentCommunity && <Text>About</Text>}
            </>
            <></>
        </PageContentLayout>
    );
};
export default CreateCommunityPostPage;
