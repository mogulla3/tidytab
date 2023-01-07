import "./options.css";

const ignoreWwwSubdomainOnSortingId = "ignore-www-subdomain-on-sorting";
const preferTagGroupToTabOnSortingId = "prefer-tagroup-to-tab-on-sorting";
const removeWwwSubdomainFromTabGroupNameId = "remove-www-subdomain-from-tabgroup-name";

const restoreOptions = () => {
  chrome.storage.sync.get(
    {
      // Default values are all true
      ignoreWwwSubdomainOnSorting: true,
      preferTagGroupToTabOnSorting: true,
      removeWwwSubdomainFromTabGroupName: true,
    },
    function (options) {
      const ignoreWwwSubdomainOnSortingOption = document.getElementById(
        ignoreWwwSubdomainOnSortingId
      ) as HTMLInputElement | null;
      const preferTagGroupToTabOnSortingOption = document.getElementById(
        preferTagGroupToTabOnSortingId
      ) as HTMLInputElement | null;
      const removeWwwSubdomainFromTabGroupNameOption = document.getElementById(
        removeWwwSubdomainFromTabGroupNameId
      ) as HTMLInputElement | null;

      if (ignoreWwwSubdomainOnSortingOption) {
        ignoreWwwSubdomainOnSortingOption.checked = options.ignoreWwwSubdomainOnSorting;
      }

      if (preferTagGroupToTabOnSortingOption) {
        preferTagGroupToTabOnSortingOption.checked = options.preferTagGroupToTabOnSorting;
      }

      if (removeWwwSubdomainFromTabGroupNameOption) {
        removeWwwSubdomainFromTabGroupNameOption.checked = options.removeWwwSubdomainFromTabGroupName;
      }
    }
  );
};

const saveOptions = () => {
  const ignoreWwwSubdomainOnSortingOption = document.getElementById(
    ignoreWwwSubdomainOnSortingId
  ) as HTMLInputElement | null;
  const preferTagGroupToTabOnSortingOption = document.getElementById(
    preferTagGroupToTabOnSortingId
  ) as HTMLInputElement | null;
  const removeWwwSubdomainFromTabGroupNameOption = document.getElementById(
    removeWwwSubdomainFromTabGroupNameId
  ) as HTMLInputElement | null;

  chrome.storage.sync.set(
    {
      ignoreWwwSubdomainOnSorting: ignoreWwwSubdomainOnSortingOption?.checked,
      preferTagGroupToTabOnSorting: preferTagGroupToTabOnSortingOption?.checked,
      removeWwwSubdomainFromTabGroupName: removeWwwSubdomainFromTabGroupNameOption?.checked,
    },
    () => {
      const saveOptionsButton = document.getElementById("save-options");
      if (saveOptionsButton) {
        const currentText = saveOptionsButton.textContent;
        saveOptionsButton.textContent = "Saved!";
        setTimeout(() => {
          saveOptionsButton.textContent = currentText;
        }, 1500);
      }
    }
  );
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save-options")?.addEventListener("click", saveOptions);
