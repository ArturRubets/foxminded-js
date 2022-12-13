// JavaScript program for Merge Sort

// Merges two subarrays of arr[].
// First subarray is arr[l..m]
// Second subarray is arr[m+1..r]
const merge = (arr, l, m, r) => {
  const n1 = m - l + 1;
  const n2 = r - m;

  const tempArrayLeft = new Array(n1);
  const tempArrayRight = new Array(n2);

  for (let i = 0; i < n1; i++) {
    tempArrayLeft[i] = arr[l + i];
  }
  for (let j = 0; j < n2; j++) {
    tempArrayRight[j] = arr[m + 1 + j];
  }

  // Merge the temp arrays back into arr[l..r]

  // Initial index of first subarray
  let i = 0;

  // Initial index of second subarray
  let j = 0;

  // Initial index of merged subarray
  let k = l;

  while (i < n1 && j < n2) {
    if (tempArrayLeft[i] <= tempArrayRight[j]) {
      arr[k] = tempArrayLeft[i];
      i++;
    } else {
      arr[k] = tempArrayRight[j];
      j++;
    }
    k++;
  }

  // Copy the remaining elements of
  // tempArrayLeft[], if there are any
  while (i < n1) {
    arr[k] = tempArrayLeft[i];
    i++;
    k++;
  }

  // Copy the remaining elements of
  // tempArrayRight[], if there are any
  while (j < n2) {
    arr[k] = tempArrayRight[j];
    j++;
    k++;
  }
};

// l is for left index and r is
// right index of the sub-array
// of arr to be sorted
const mergeSort = (arr, l, r) => {
  if (l >= r) {
    return;
  }
  const m = l + parseInt((r - l) / 2);
  mergeSort(arr, l, m);
  mergeSort(arr, m + 1, r);
  merge(arr, l, m, r);
};

const arr3 = [12, 11, 13, 5, 6, 7];
mergeSort(arr3, 0, arr3.length - 1);
console.log(arr3);
