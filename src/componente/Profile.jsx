import img from "../assets/react.svg"

export default function Profile() {
  const user = {
    name: "Paras Vaghela",
    age: 25,
    gender: "Male",
    blockAmount: 50000,
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <img
        src={img}
        alt="profile"
        style={{ borderRadius: "50%" }}
      />
      <h2>{user.name}</h2>
      <p>Age: {user.age}</p>
      <p>Gender: {user.gender}</p>
      <p>Block Amount: ₹{user.blockAmount}</p>
    </div>
  );
}