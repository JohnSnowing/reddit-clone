import { Flex, Image } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
    const [user] = useAuthState(auth);
    return (
        <Flex
            bg="white"
            height="44px"
            padding="6px 12px"
            justifyContent={{ md: "space-between" }}
        >
            <Flex
                align="center"
                width={{ base: "40px", md: "auto" }}
                mr={{ base: 0, md: 2 }}
            >
                <Image src="/images/redditFace.svg" height="30px" />
                <Image
                    src="/images/redditText.svg"
                    height="46px"
                    display={{ base: "none", md: "unset" }}
                />
            </Flex>
            <SearchInput user={user as User} />
            <RightContent user={user as User} />
            {/* <Directory />
            <SearchInput />
            <RightContent /> */}
        </Flex>
    );
};
export default Navbar;
