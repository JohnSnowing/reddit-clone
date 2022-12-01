import { Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import AuthModal from "../../Modal/Auth/AuthModal";
import AuthButton from "./AuthButton";
import Icons from "./Icons";
import MenuWrapper from "./ProfileMenu/MenuWrapper";

type RightContentProps = {
    user: User;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
    return (
        <>
            <AuthModal />
            <Flex justifyContent="space-between" alignItems="center">
                {user ? <Icons /> : <AuthButton />}
                <MenuWrapper />
            </Flex>
        </>
    );
};
export default RightContent;
