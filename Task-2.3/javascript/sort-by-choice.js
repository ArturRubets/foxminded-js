// Javascript program for implementation of selection sort

const selectionSort = (arr, n) => {
  const swap = (arr, idx1, idx2) => {
    const temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
  };

  let i, j, minIdx;

  // One by one move boundary of unsorted subarray
  for (i = 0; i < n - 1; i++) {
    // Find the minimum element in unsorted array
    minIdx = i;
    for (j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // Swap the found minimum element with the first element
    if (minIdx > i) {
      swap(arr, minIdx, i);
    }
  }

  return arr;
};

const arr5 = [64, 25, 12, -22, 11];
const sortedArr5 = selectionSort(arr5, arr5.length);
console.log('sort by choice sorting', sortedArr5);
