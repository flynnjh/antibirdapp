import Profile from "../components/Profile";

const ProfileScreen = (props) => {
  const username = props.route.params.username;
  return <Profile username={username} />;
};

export default ProfileScreen;
