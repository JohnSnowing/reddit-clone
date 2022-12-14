import React from "react";
import { Community } from "../../atoms/communitiesAtom";

type HeaderProps = {
    communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
    return <div>Have a good coding</div>;
};
export default Header;
