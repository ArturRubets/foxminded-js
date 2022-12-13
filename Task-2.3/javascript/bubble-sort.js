// Optimized implementation of bubble sort Algorithm

const bubbleSort = (arr) => {
  const len = arr.length;
  let i, j;
  let isSwapped = false;

  for (i = 0; i < len; i++) {
    isSwapped = false;

    for (j = 0; j < len; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        isSwapped = true;
      }
    }

    // If no two elements were swapped by inner loop, then break
    if (!isSwapped) {
      break;
    }
  }

  return arr;
};

const arr1 = [243, 45, 23, 356, 3, 5346, 35, 5];
const sortedArr1 = bubbleSort(arr1);
console.log(sortedArr1);
