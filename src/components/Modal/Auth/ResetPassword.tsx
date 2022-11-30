import { Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { useResetRecoilState } from "recoil";
import { authModalState, ModalView } from "../../../atoms/authModalAtoms";
import { auth } from "../../../firebase/clientApp";
import { BsReddit, BsDot } from "react-icons/bs";

type ResetPasswordProps = { toggleView: (view: ModalView) => void };

const ResetPassword: React.FC<ResetPasswordProps> = ({ toggleView }) => {
    const setAuthModalState = useResetRecoilState(authModalState);
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [sendPasswordResetEmail, sending, error] =
        useSendPasswordResetEmail(auth);

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await sendPasswordResetEmail(email);
        setSuccess(true);
    };

    return (
        <Flex direction="column" alignItems="center" width="100%">
            <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
            <Text fontWeight={700} mb={2}>
                Reset your password
            </Text>
            {success ? (
                <Text mb={4}>Check your email :)</Text>
            ) : (
                <>
                    <Text fontSize="sm" textAlign="center" mb={2}>
                        Enter the email associated with your account and we will
                        send you a reset link
                    </Text>
                    <form onSubmit={onSubmit} style={{ width: "100%" }}>
                        <Input
                            type="email"
                            value={email}
                            required
                            placeholder="email"
                            mb={2}
                            fontSize="10pt"
                            _placeholder={{ color: "gray.500" }}
                            _hover={{
                                bg: "white",
                                border: "1px solid",
                                borderColor: "blue.500",
                            }}
                            _focus={{
                                outline: "none",
                                bg: "white",
                                border: "1px solid",
                                borderColor: "blue.500",
                            }}
                            onChange={(event) => setEmail(event.target.value)}
                            bg="gray.50"
                        />
                        <Text textAlign="center" fontSize="10pt" color="red">
                            {error?.message}
                        </Text>
                        <Button
                            width="100%"
                            height="36px"
                            mb={2}
                            mt={2}
                            type="submit"
                            isLoading={sending}
                        >
                            Reset Password
                        </Button>
                    </form>
                </>
            )}
            <Flex
                alignItems="center"
                fontSize="9pt"
                color="blue.500"
                fontWeight={700}
                cursor="pointer"
            >
                <Text onClick={() => toggleView("login")}>LOGIN</Text>
                <Icon as={BsDot} />
                <Text onClick={() => toggleView("signup")}>SIGN UP</Text>
            </Flex>
        </Flex>
    );
};
export default ResetPassword;
