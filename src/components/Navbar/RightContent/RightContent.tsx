import { Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButton from "./AuthButton";
import Icons from "./Icons";

type RightContentProps = {
    user: User;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
    return (
        <>
            <AuthModal />
            <Flex justifyContent="space-between" alignItems="center">
                {user ? <Icons /> : <AuthButton />}
            </Flex>
        </>
    );
};
export default RightContent;
