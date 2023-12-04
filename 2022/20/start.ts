import { sign } from 'crypto';
import fs from 'fs';
import { EOL } from 'os';
import path from 'path';

//const file = './files/example.txt';
const file = './files/input.txt';

type Node = {
  value: number;
  prev?: Node;
  next?: Node;
};

const createListFromInput = (input: string, decryptionKey: number): Node[] => {
  const nodeList: Node[] = [];

  input
    .split(EOL)
    .map((x) => parseInt(x))
    .forEach((v, i) => {
      const node: Node = { value: v * decryptionKey };
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
    nodeToMoveBefore = nodeToMoveBefore.next!;

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
  for (let x = 0; x <= positions; x++) nodeToMoveAfter = nodeToMoveAfter.prev!;

  // Lift out node by connecting ones either side of it
  nodeToMove.prev!.next = nodeToMove.next;
  nodeToMove.next!.prev = nodeToMove.prev;

  // Insert the node into new position
  nodeToMove.next = nodeToMoveAfter.next;
  nodeToMove.prev = nodeToMoveAfter;
  nodeToMoveAfter.next = nodeToMove;
  nodeToMove.next!.prev = nodeToMove;
};

const logList = (zeroNode: Node) => {
  let currentNode = zeroNode!.next;
  console.log(0);
  while (currentNode != zeroNode) {
    console.log(currentNode?.value);
    currentNode = currentNode?.next;
  }
};

const start = async () => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf8');

  const startTime = performance.now();

  const nodeList = createListFromInput(content, 811589153);
  const zeroNode = nodeList.find((n) => n.value === 0);
  const listLength = nodeList.length;

  for (let mix = 0; mix < 10; mix++) {
    for (const nodeToMove of nodeList) {
      if (nodeToMove.value === 0) continue;

      // Optimization - Check if number wraps round. Because we're moving
      // the number within a list it's in, the modulo is of the list
      // length - 1;
      let movement = nodeToMove.value % (listLength - 1);

      // Skip if number would remain in same place
      if (movement === 0) {
        //console.log(`Skipping ${nodeToMove.value} as it would not move`);
        continue;
      }

      // Optimization - if moving a greater distance than half the list, then
      // go the other way
      if (Math.abs(movement) > listLength / 2) {
        movement =
          (listLength - Math.abs(movement) - 1) * Math.sign(movement) * -1;
      }

      if (movement > 0) {
        moveRight(nodeToMove, movement);
      } else {
        moveLeft(nodeToMove, -movement);
      }
    }
  }

  //logList(zeroNode!);

  // Get 1000, 2000 and 3000 after zero.
  let currentNode = zeroNode;
  let total = 0;
  for (let x = 1; x <= 3000; x++) {
    currentNode = currentNode?.next;
    if (x % 1000 == 0) {
      console.log(currentNode?.value);
      total += currentNode!.value;
    }
  }
  console.log(`Total: ${total}`);

  console.log(
    `Execution took ${(performance.now() - startTime).toFixed(2)} milliseconds`,
  );
};

start();
