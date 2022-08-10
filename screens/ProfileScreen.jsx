import Profile from "../components/Profile";

// TODO: Implement Profile Search

const ProfileScreen = (props) => {
  const username = props.route.params.username;
  return <Profile username={username} />;
};

export default ProfileScreen;
