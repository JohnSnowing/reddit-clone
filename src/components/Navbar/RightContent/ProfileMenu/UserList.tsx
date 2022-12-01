import { Flex, Icon, MenuDivider, MenuItem } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import React from "react";
import { auth } from "../../../../firebase/clientApp";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";

type UserListProps = {};

const UserList: React.FC<UserListProps> = () => {
    const logout = async () => {
        await signOut(auth);
    };

    return (
        <>
            <MenuItem
                fontSize="10pt"
                fontWeight={700}
                _hover={{ bg: "blue.500", color: "white" }}
            >
                <Flex alignItems="center">
                    <Icon fontSize={20} mr={2} as={CgProfile} />
                    Profile
                </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
                fontSize="10pt"
                fontWeight={700}
                _hover={{ bg: "blue.500", color: "white" }}
                onClick={logout}
            >
                <Flex alignItems="center">
                    <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                    Logout
                </Flex>
            </MenuItem>
        </>
    );
};
export default UserList;
