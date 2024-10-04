import Bool "mo:base/Bool";
import List "mo:base/List";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor ShoppingList {
  public type Item = {
    id: Nat;
    text: Text;
    completed: Bool;
  };

  stable var items: [Item] = [];
  stable var nextId: Nat = 0;

  public func addItem(text: Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newItem: Item = {
      id;
      text;
      completed = false;
    };
    items := Array.append(items, [newItem]);
    id
  };

  public query func getItems() : async [Item] {
    items
  };

  public func updateItem(id: Nat, completed: Bool) : async Bool {
    let index = Array.indexOf<Item>({ id; text = ""; completed = false }, items, func(a, b) { a.id == b.id });
    switch (index) {
      case null { false };
      case (?i) {
        let updatedItem = {
          id = items[i].id;
          text = items[i].text;
          completed;
        };
        items := Array.tabulate(items.size(), func (j: Nat) : Item {
          if (j == i) { updatedItem } else { items[j] }
        });
        true
      };
    }
  };

  public func deleteItem(id: Nat) : async Bool {
    let filtered = Array.filter<Item>(items, func(item) { item.id != id });
    if (filtered.size() < items.size()) {
      items := filtered;
      true
    } else {
      false
    }
  };
}
