import { Flex, Image } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { defaultMenuItem } from "../../atoms/directoryMenuAtom";
import { auth } from "../../firebase/clientApp";
import useDirectory from "../../hooks/useDirectory";
import Directory from "./Directory/Directory";
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
    const [user] = useAuthState(auth);

    const { onSelectMenuItem } = useDirectory();
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
                cursor="pointer"
                onClick={() => onSelectMenuItem(defaultMenuItem)}
            >
                <Image
                    src="/images/redditFace.svg"
                    height="30px"
                    alt="reddit-logo"
                />
                <Image
                    src="/images/redditText.svg"
                    height="46px"
                    display={{ base: "none", md: "unset" }}
                    alt="reddit-text"
                />
            </Flex>
            {user && <Directory />}
            <SearchInput user={user as User} />
            <RightContent user={user as User} />
        </Flex>
    );
};
export default Navbar;
