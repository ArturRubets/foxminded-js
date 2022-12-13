// Javascript implementation of QuickSort

/* This function takes last element as pivot, places
the pivot element at its correct position in sorted
array, and places all smaller (smaller than pivot)
to left of pivot and all greater elements to right
of pivot */
const partition = (arr, low, high) => {
  // A utility function to swap two elements
  const swap = (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  };

  // pivot
  const pivot = arr[high];

  // Index of smaller element and
  // indicates the right position
  // of pivot found so far
  let i = low - 1;

  for (let j = low; j <= high - 1; j++) {
    // If current element is smaller
    // than the pivot
    if (arr[j] < pivot) {
      // Increment index of
      // smaller element
      i++;
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, high);
  return i + 1;
};

/* The main function that implements QuickSort
		arr[] --> Array to be sorted,
		low --> Starting index,
		high --> Ending index
*/
const quickSort = (arr, low, high) => {
  if (low < high) {
    // pi is partitioning index, arr[p]
    // is now at right place
    const pi = partition(arr, low, high);

    // Separately sort elements before
    // partition and after partition
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
};

const arr4 = [10, 7, 8, 9, 1, 5];
quickSort(arr4, 0, arr4.length - 1);
console.log('quicksort sorting', arr4);
