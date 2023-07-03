import { useState } from "react";
import { useEffect } from "react";

export default function BuyBlock() {
    const [itemName, setItemName] = useState("");
    const [price, setPrice] = useState("");
    const [allItemNames, setAllItemNames] = useState([]);

    useEffect(() => {
      fetch("http://127.0.0.1:8000/all_items")
        .then((response) => response.json())
        .then((data) => {
          setAllItemNames(data.item_names);
        })
        .catch((error) => console.log(error));
    }, []);

    const handleItemNameChange = (event) => {
      const inputValue = event.target.value;
      const formattedInputValue = inputValue.replace(/\s+/g, "_");
      setItemName(formattedInputValue);
    };
    
    const handleButtonClick = () => {
      if (itemName === "" || price === "" || isNaN(price)) {
        // Check if either textbox is empty or price is not a number
        return;
      }
  
      const formattedItemName = itemName.replace(/\s+/g, "_").toLowerCase();

      if (!allItemNames.includes(formattedItemName)) {
        // Check if the formatted item name is not in the predetermined list
        return;
      }
  
      const itemData = {
        name: formattedItemName,
        purchasePrice: price,
        number: 1,
      };
      document.getElementById("buyButton").disabled = true;
  
      fetch("http://127.0.0.1:8000/item/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle response data if needed
          console.log(data);
  
          // Send transaction data
          const transactionData = {
            name: formattedItemName,
            transaction_type: "buy",
            price: price,
          };
  
          fetch("http://127.0.0.1:8000/transaction/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionData),
          })
            .then((response) => response.json())
            .then((transactionResponse) => {
              // Handle transaction response if needed
              console.log(transactionResponse);
  
              // Reset input values
              setItemName("");
              setPrice("");
  
              //window.location.reload();
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
  
      setItemName("");
      setPrice("");
      document.getElementById("buyButton").disabled = false;
    };
    
    return (
      <div className="items-center justify-center p-8 pb-12 rounded-full  bg-black-custom shadow-lg shadow-slate-400">
        <h1 className="pb-4 text-lg">Purchase New Item:</h1>
        <input
        className="text-center py-2 px-4 mb-4 border border-purple-custom-saturated rounded-lg bg-slate-600 text-white-custom"
        type="text"
        list="itemNames"
        placeholder="Item Name"
        value={itemName}
        onChange={handleItemNameChange}
      />
      <datalist id="itemNames">
        {allItemNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
        <input
          className="text-center py-2 px-4 mb-4 border border-purple-custom-saturated rounded-lg bg-slate-600 text-white-custom"
          type="text"
          placeholder="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
        <div className="pt-2">
        <button className="py-2 px-6 rounded-md bg-purple-custom-saturated text-white-custom shadow-md shadow-purple-700" onClick={handleButtonClick} id="buyButton">Buy</button>
        </div>
      </div>
    );
  }