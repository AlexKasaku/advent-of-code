import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';
//const file = './files/test.txt';

type Node = {
  value: number;
  prev?: Node;
  next?: Node;
};

const createListFromInput = (input: string): Node[] => {
  const nodeList: Node[] = [];

  input
    .split(EOL)
    .map((x) => parseInt(x))
    .forEach((v, i) => {
      const node: Node = { value: v };
      if (i > 0) {
        node.prev = nodeList[i - 1];
        nodeList[i - 1].next = node;
      }
      nodeList.push(node);
    });

  // Connect the ends of the list
  nodeList[0].prev = nodeList[nodeList.length - 1];
  nodeList[nodeList.length - 1].next = nodeList[0];
  return nodeList;
};

const moveRight = (nodeToMove: Node, positions: number): void => {
  let nodeToMoveBefore = nodeToMove;
  for (let x = 0; x <= positions; x++)
    nodeToMoveBefore = nodeToMoveBefore?.next!;

  console.log(
    `Moving ${nodeToMove.value} between ${nodeToMoveBefore.prev!.value} and ${
      nodeToMoveBefore.value
    }`
  );
  // Move nodes

  // Lift out node by connecting ones either side of it
  nodeToMove.prev!.next = nodeToMove.next;
  nodeToMove.next!.prev = nodeToMove.prev;

  // Insert the node into new position
  nodeToMove.prev = nodeToMoveBefore.prev;
  nodeToMove.next = nodeToMoveBefore;
  nodeToMoveBefore.prev = nodeToMove;
  nodeToMove.prev!.next = nodeToMove;
};

const moveLeft = (nodeToMove: Node, positions: number): void => {
  let nodeToMoveAfter = nodeToMove;
  for (let x = 0; x <= positions; x++) nodeToMoveAfter = nodeToMoveAfter?.prev!;

  console.log(
    `Moving ${nodeToMove.value} between ${nodeToMoveAfter.value} and ${
      nodeToMoveAfter.next!.value
    }`
  );

  // Move nodes

  // Lift out node by connecting ones either side of it
  nodeToMove.prev!.next = nodeToMove.next;
  nodeToMove.next!.prev = nodeToMove.prev;

  // Insert the node into new position
  nodeToMove.next = nodeToMoveAfter.next;
  nodeToMove.prev = nodeToMoveAfter;
  nodeToMoveAfter.next = nodeToMove;
  nodeToMove.next!.prev = nodeToMove;
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const nodeList = createListFromInput(content);
  const zeroNode = nodeList.find((n) => n.value === 0);
  const listLength = nodeList.length;

  while (nodeList.length > 0) {
    const nodeToMove = nodeList.shift()!;

    //console.log(`Moving ${nodeToMove.value}`);

    if (nodeToMove.value === 0) continue;

    // Optimization - Check if number wraps round. Because we're moving
    // the number within a list it's in, the modulo is of the list length
    // - 1;
    const movement = nodeToMove.value % (listLength - 1);

    // Skip if number would remain in same place
    if (movement === 0) {
      console.log(`Skipping ${nodeToMove.value} as it would not move`);
    }

    if (movement > 0) {
      moveRight(nodeToMove, movement);
    } else {
      moveLeft(nodeToMove, -movement);
    }
  }

  // let currentNode = zeroNode!.next;
  // console.log(0);
  // while (currentNode != zeroNode) {
  //   console.log(currentNode?.value);
  //   currentNode = currentNode?.next;
  // }

  let currentNode = zeroNode;
  let total = 0;
  for (let x = 1; x <= 3000; x++) {
    currentNode = currentNode?.next;
    if (x % 1000 == 0) {
      console.log(currentNode?.value);
      total += currentNode!.value;
    }
  }

  // Submitted: 8494, too high.

  console.log(`Total: ${total}`);
};

start();
