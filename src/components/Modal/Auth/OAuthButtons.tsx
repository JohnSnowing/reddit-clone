import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { type } from "os";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { ModalView } from "../../../atoms/authModalAtoms";
import { auth } from "../../../firebase/clientApp";

type OAuthButtonsProps = {
    toggleView: (view: ModalView) => void;
};

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ toggleView }) => {
    const [signInWithGoogle, _, loading, error] = useSignInWithGoogle(auth);
    return (
        <Flex direction="column" width="100%" mb={4}>
            <Button
                variant="oauth"
                mb={2}
                onClick={() => signInWithGoogle()}
                isLoading={loading}
            >
                <Image src="/images/googlelogo.png" height="20px" mr={4} />
                Continue with Google
            </Button>
            <Button variant="oauth">Some other Provider</Button>
            {error && (
                <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
                    {error.message}
                </Text>
            )}
        </Flex>
    );
};
export default OAuthButtons;
