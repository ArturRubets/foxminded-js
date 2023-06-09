// Javascript program for insertion sort

// Function to sort an array using insertion sort
const insertionSort = (arr, n) => {
  let i, key, j;
  for (i = 1; i < n; i++) {
    key = arr[i];
    j = i - 1;

    /* Move elements of arr[0..i-1], that are
		greater than key, to one position ahead
		of their current position */
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }

  return arr;
};

const arr2 = [12, 11, 13, 5, 6];
const sortedArr2 = insertionSort(arr2, arr2.length);
console.log('insertion sorting', sortedArr2);
