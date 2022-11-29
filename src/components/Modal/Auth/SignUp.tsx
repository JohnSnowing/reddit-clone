import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { authModalState, ModalView } from "../../../atoms/authModalAtoms";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../firebase/errors";

type SignUpProps = {
    toggleView: (view: ModalView) => void;
};

const SignUp: React.FC<SignUpProps> = ({ toggleView }) => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [formError, setFormError] = useState("");
    const [createUserWithEmailAndPassword, _, loading, authError] =
        useCreateUserWithEmailAndPassword(auth);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formError) setFormError("");

        if (!form.email.includes("@")) {
            return setFormError("Please enter a valid email");
        }
        if (form.password !== form.confirmPassword) {
            setFormError("Passwords do not match");
            return;
        }

        createUserWithEmailAndPassword(form.email, form.password);
    };

    const onChange = ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name="email"
                placeholder="email"
                type="email"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "White",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
            />
            <Input
                required
                name="password"
                placeholder="password"
                type="password"
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "White",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
                mb={2}
            />
            <Input
                required
                name="confirmPassword"
                placeholder="confirm password"
                type="password"
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                _focus={{
                    outline: "none",
                    bg: "White",
                    border: "1px solid",
                    borderColor: "blue.500",
                }}
                bg="gray.50"
                mb={2}
            />
            <Text textAlign="center" color="red" fontSize="10pt">
                {formError ||
                    FIREBASE_ERRORS[
                        authError?.message as keyof typeof FIREBASE_ERRORS
                    ]}
            </Text>

            <Button
                width="100%"
                height="36px"
                mt={2}
                mb={2}
                type="submit"
                isLoading={loading}
            >
                Sign Up
            </Button>
            <Flex fontSize="9pt" justifyContent="center">
                <Text mr={1}>Already a redditor?</Text>
                <Text
                    color="blue.500"
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            view: "login",
                        }))
                    }
                >
                    LOG IN
                </Text>
            </Flex>
        </form>
    );
};
export default SignUp;
