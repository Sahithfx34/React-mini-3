import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children,onClick}){
  return <button onClick={onClick} className="button">{children}</button>
}
export default function App(){
  const [showFormAddFriend,setFormAddFriend] = useState(false);
  const [friends,setFriends] = useState(initialFriends);
  const [selectedFriends, SetselectedFriends] = useState(null);

  
  function renderNewFriend(friend){
    setFriends(()=>[...friends,friend])
    setFormAddFriend(false);
  }
  function handleSelection(friend){
    SetselectedFriends((cur)=> cur?.id === friend.id ? null : friend);
    setFormAddFriend(false);
  }
  function splitBill(value){

    setFriends(friends =>
       friends.map(friend=>
         friend.id === selectedFriends.id
          ?{...friend,balance: friend.balance+value}
          :friend
        )
    );

    SetselectedFriends(null);

  }
  return(
    <div className="app">
      <div className="sidebar">
        <RenderFriends 
        friends={friends} 
        Selected={handleSelection}
        selectedFriends={selectedFriends}
        />
        {showFormAddFriend && <FormAddFriend renderNewFriend={renderNewFriend}/>}
        <Button onClick={()=>setFormAddFriend(!showFormAddFriend)}>{showFormAddFriend ? "Close friend" : "Add friend" }</Button>
      </div>
      {selectedFriends && <FormSplitBill selectedFriends={selectedFriends} splitBill={splitBill} />}
    </div>
  )
}

function RenderFriends({friends,Selected,selectedFriends}){
  return(
      <ul>
        {friends.map((friend => <Friend friend={friend} Selected={Selected}  selectedFriends={selectedFriends} key = {friend.id}/>))}
      </ul>
  )
}

function Friend({friend,Selected,selectedFriends}){
  const isSelected = selectedFriends?.id === friend.id;
  return(
      <li>
        <img src= {friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance <0 && 
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>}
        {friend.balance >0 &&
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>}
        {friend.balance === 0 && 
        <p>You and {friend.name} are even</p>}
        <Button 
          onClick={()=> Selected(friend)}>
          {isSelected ? "close":"Select"}
        </Button>
      </li>
  )
}


function FormAddFriend({renderNewFriend}){
  const [addfriend,setaddfriend] = useState("");
  const [image,setImage] = useState("https://i.pravatar.cc/48?u=499476");
  
  function handleSubmit(e){
    e.preventDefault();
    if(!addfriend || !image) return;

    const id=crypto.randomUUID()
    const Newfriend = {
      id,
      name:addfriend,
      image:`${image}?=${id}`,
      balance:0,
    }

    renderNewFriend(Newfriend);
    
    setaddfriend("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }
  return(
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label><span> </span>Friends🫂</label>
      <input 
      type="text" 
      value={addfriend} 
      onChange={(e)=>setaddfriend(e.target.value)}
      ></input>

      <label><span> </span>Image🌄</label>
      <input type="text"
      value={image}
      onChange={(e)=>setImage(e.target.value)} 
      />

      <Button>ADD</Button>
    </form>
  )
}

function FormSplitBill({selectedFriends,splitBill}){
  const [bill,setBill] = useState("");
  const [paidByUser,setPayByUser] = useState("");
  const share = bill ? bill-paidByUser : "";
  const [whoIsPaying,SetwhoIsPaying] = useState("user");

  function handleSubmit(e){
    e.preventDefault();
    if(!bill || !paidByUser) return;
    splitBill(whoIsPaying === "user" ? paidByUser:-paidByUser);
  }
  return(
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriends.name}</h2>
      <label>💵 Bill Value</label>
      <input 
      type="text" 
      value= {bill}
      onChange={(e)=>setBill(Number(e.target.value))}
      />
      <label>🧍🏻Your expense</label>
      <input type="text"
      value= {paidByUser}
      onChange={(e)=>setPayByUser(Number(e.target.value)> bill ? paidByUser : Number(e.target.value) )}
      />
      <label>🧑🏻‍🤝‍🧑🏻 {selectedFriends.name}'s expense</label>
      <input type="text" disabled value={share}/>
      <label>🤑 Who is paying the bill?</label>
      <select value={whoIsPaying} onChange={e=>SetwhoIsPaying(e.target.value)}>
        <option value="user" >You</option>
        <option value="friend">{selectedFriends.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  )
}