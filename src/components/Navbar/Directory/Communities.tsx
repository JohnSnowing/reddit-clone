import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GrAdd } from "react-icons/gr";
import { auth } from "../../../firebase/clientApp";
import CreateCommunityModal from "../../Modal/CreateCommunity";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
    const [user] = useAuthState(auth);
    const [open, setOpen] = useState(false);
    return (
        <>
            <CreateCommunityModal
                isOpen={open}
                handleClose={() => setOpen(false)}
                userId={user?.uid!}
            />
            <MenuItem
                width="100%"
                fontSize="10pt"
                _hover={{ bg: "gray.100" }}
                onClick={() => {
                    setOpen(true);
                }}
            >
                <Flex alignItems="center">
                    <Icon fontSize={20} mr={2} as={GrAdd} />
                    Create Community
                </Flex>
            </MenuItem>
        </>
    );
};
export default Communities;
