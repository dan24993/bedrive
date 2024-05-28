var _a, _b;
import { jsxs, jsx, Fragment as Fragment$1 } from "react/jsx-runtime";
import { useParams, useNavigate, useLocation, Link, useSearchParams, useRoutes } from "react-router-dom";
import { useInfiniteQuery, keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { t as queryClient, aN as getFromLocalStorage, s as setInLocalStorage, ad as getBootstrapData, a as apiClient, w as showHttpErrorToast, m as message, v as toast, aO as useAuth, af as MenuTrigger, e as IconButton, aB as KeyboardArrowDownIcon, ag as Menu, I as Item, T as Trans, Q as Tooltip, B as Button, c as useIsMobileMediaQuery, aP as Navbar$1, av as FileTypeIcon, l as useTrans, z as SvgImage, aQ as secureFilesSvg, n as TextField, aR as getAxiosErrorMessage, ak as prettyBytes, aS as useFileUploadStore, u as useSettings, aT as getActiveWorkspaceId, aU as UploadedFile, at as openUploadWindow, O as FormattedDate, j as Checkbox, a7 as ProgressCircle, aV as AdHost, p as opacityAnimation, k as DialogTrigger, a3 as Section, a5 as FileUploadProvider, y as IllustratedMessage, aM as NotFoundPage, aW as ProgressBarBase, aX as WorkspaceQueryKeys, H as onFormQueryError, g as useDialogContext, D as Dialog, h as DialogHeader, i as DialogBody, F as Form, J as FormTextField, G as DialogFooter, aY as useActiveWorkspaceId, aZ as PersonalWorkspace, x as ConfirmationDialog, Z as useValueLists, a_ as ExitToAppIcon, M as CloseIcon, A as ArrowDropDownIcon, ab as LinkStyle, X as ButtonBase, aD as UnfoldMoreIcon, a$ as useUserWorkspaces, b0 as useActiveWorkspace, as as openDialog, L as CheckIcon, W as createEventHandler, a8 as useNavigate$1, b1 as CustomMenuItem, C as CustomMenu, b2 as shallowEqual, o as SearchIcon, b3 as ContextMenu, b4 as useMediaQuery, a4 as MixedText, E as ErrorIcon, aA as WarningIcon, b5 as CheckCircleIcon, ac as SiteConfigContext, b6 as ComboBoxForwardRef, $ as List, a0 as ListItem, r as StaticPageTitle, aL as AuthRoute } from "../server-entry.mjs";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import React, { Fragment, useState, useCallback, createElement, useContext, useRef, useEffect, forwardRef, cloneElement, createContext, useMemo, useLayoutEffect, memo, useId } from "react";
import { R as useFileEntryUrls, i as downloadFileFromUrl, j as FileDownloadIcon, V as FileThumbnail, L as LinkIcon, w as DeleteIcon, W as TableContext, M as MoreVertIcon, T as Table, G as FilePreviewDialog, D as DashboardLayout, a as DashboardNavbar, c as DashboardContent, X as FilePreviewContainer, Y as FileEntryUrlsContext, x as ChipField, A as AddIcon, t as useDroppable, s as useDraggable, Z as FILE_ENTRY_TYPE_FILTER, F as FilterOperator, d as FilterControlType, e as createdAtFilter, u as updatedAtFilter, _ as DashboardLayoutContext, h as FilterList, r as droppables, o as usePointerEvents, v as updateRects, $ as activeInteraction, a0 as isCtrlOrShiftPressed, a1 as isCtrlKeyPressed, k as Avatar, z as useNormalizedModels, p as Switch, m as FormSwitch, l as FormDatePicker, O as ArrowBackIcon, a2 as dragMonitors, Q as InfoIcon, b as DashboardSidenav } from "./Info-127d05d2.mjs";
import { I as ImportExportIcon, R as RemoveRedEyeIcon, P as PersonAddIcon, S as StarIcon, a as StarOutlineIcon, D as DriveFileMoveIcon, b as DriveFileRenameOutlineIcon, C as ContentCopyIcon, c as RestoreIcon, d as CreateNewFolderIcon, F as FileUploadIcon, e as DriveFolderUploadIcon, f as DeleteForeverIcon, g as SortIcon, G as GridViewIcon, h as StorageIcon, i as GroupIcon, A as ArrowRightIcon, B as BackupIcon, j as FolderIcon, U as UploadFileIcon, k as GroupsIcon, V as ViewListIcon, l as ViewModuleIcon } from "./ViewModule-c87397b3.mjs";
import { AnimatePresence, m } from "framer-motion";
import clsx from "clsx";
import memoize from "nano-memoize";
import { enableMapSet } from "immer";
import { B as Breadcrumb, a as BreadcrumbItem, S as SectionHelper, E as EditIcon, C as ChevronRightIcon } from "./Edit-48c44acf.mjs";
import { useForm } from "react-hook-form";
import { arrayToTree } from "performant-array-to-tree";
import { mergeProps } from "@react-aria/utils";
import { useFocusManager, FocusScope } from "@react-aria/focus";
import { useControlledState } from "@react-stately/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import axios from "axios";
import useClipboard from "react-use-clipboard";
import { now, getLocalTimeZone } from "@internationalized/date";
import "react-dom/server";
import "process";
import "http";
import "react-router-dom/server.mjs";
import "nanoid";
import "@floating-ui/react-dom";
import "react-merge-refs";
import "react-dom";
import "deepmerge";
import "@internationalized/number";
import "@react-aria/ssr";
import "dot-object";
import "axios-retry";
import "tus-js-client";
import "react-use-cookie";
import "mime-match";
import "@react-aria/interactions";
const DriveQueryKeys = {
  fetchEntries: (params) => {
    const key = ["drive-entries"];
    if (params)
      key.push(params);
    return key;
  },
  fetchUserFolders(params) {
    const key = ["user-folders"];
    if (params) {
      key.push(params);
    }
    return key;
  },
  fetchShareableLink: (params) => {
    const key = ["shareable-link"];
    if (params) {
      key.push(params);
    }
    return key;
  },
  fetchFolderPath(hash, params) {
    const key = ["folder-path"];
    if (hash) {
      key.push(hash);
    }
    if (params) {
      key.push(params);
    }
    return key;
  },
  fetchEntryShareableLink: (entryId) => {
    return ["file-entries", entryId, "shareable-link"];
  },
  fetchFileEntry: (id) => {
    const key = ["drive/file-entries/model"];
    if (id)
      key.push(id);
    return key;
  },
  fetchStorageSummary: ["storage-summary"]
};
function invalidateEntryQueries() {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: DriveQueryKeys.fetchEntries() }),
    queryClient.invalidateQueries({ queryKey: DriveQueryKeys.fetchFolderPath() }),
    queryClient.invalidateQueries({
      queryKey: DriveQueryKeys.fetchUserFolders()
    }),
    // fetching model for single file entry in "useFileEntry"
    queryClient.invalidateQueries({ queryKey: DriveQueryKeys.fetchFileEntry() })
  ]);
}
const useLinkPageStore = create()(
  immer((set) => ({
    password: null,
    viewMode: getFromLocalStorage("drive.viewMode"),
    activeSort: {
      orderBy: "updated_at",
      orderDir: "desc"
    },
    setPassword: (value) => {
      set((state) => {
        state.password = value;
      });
    },
    isPasswordProtected: false,
    setIsPasswordProtected: (value) => {
      set((state) => {
        state.isPasswordProtected = value;
      });
    },
    setViewMode: (mode) => {
      set((state) => {
        state.viewMode = mode;
        setInLocalStorage("drive.viewMode", mode);
      });
    },
    setActiveSort: (value) => {
      set((state) => {
        state.activeSort = value;
      });
    }
  }))
);
function linkPageState() {
  return useLinkPageStore.getState();
}
function useShareableLinkPage() {
  var _a2, _b2;
  const { hash } = useParams();
  const { orderBy, orderDir } = useLinkPageStore((s) => s.activeSort);
  const order = `${orderBy}:${orderDir}`;
  const isPasswordProtected = useLinkPageStore((s) => s.isPasswordProtected);
  const password = useLinkPageStore((s) => s.password);
  const query = useInfiniteQuery({
    queryKey: DriveQueryKeys.fetchShareableLink({ hash, sort: order }),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchLinkByHash({
        hash,
        page: pageParam,
        order,
        password
      });
      if (response.passwordInvalid) {
        linkPageState().setIsPasswordProtected(true);
      }
      return response;
    },
    initialData: () => {
      var _a3, _b3;
      const data = (_a3 = getBootstrapData().loaders) == null ? void 0 : _a3.shareableLinkPage;
      if (data && ((_b3 = data.link) == null ? void 0 : _b3.hash) === hash) {
        if (data.passwordInvalid) {
          linkPageState().setIsPasswordProtected(true);
        }
        return {
          pageParams: [void 0, 1],
          pages: [data]
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (!lastResponse.folderChildren)
        return void 0;
      const currentPage = lastResponse.folderChildren.current_page;
      const lastPage = lastResponse.folderChildren.last_page;
      if (currentPage >= lastPage) {
        return void 0;
      }
      return currentPage + 1;
    },
    // disable query if link is password protected and correct
    // password was not entered yet, to prevent unnecessary requests
    enabled: !!hash && !isPasswordProtected || password != null,
    placeholderData: keepPreviousData
  });
  return {
    ...query,
    link: (_a2 = query.data) == null ? void 0 : _a2.pages[0].link,
    entries: (_b2 = query.data) == null ? void 0 : _b2.pages.flatMap((p) => {
      var _a3;
      return (_a3 = p.folderChildren) == null ? void 0 : _a3.data;
    })
  };
}
function fetchLinkByHash({
  hash,
  page = 1,
  order,
  password
}) {
  return apiClient.get(`shareable-links/${hash}`, {
    params: { loader: "shareableLinkPage", page, order, password }
  }).then((response) => response.data);
}
function checkLinkPassword({ password, linkHash }) {
  return apiClient.post(`shareable-links/${linkHash}/check-password`, { password }).then((r) => r.data);
}
function useCheckLinkPassword() {
  return useMutation({
    mutationFn: (props) => checkLinkPassword(props),
    onSuccess: (response, props) => {
      if (response.matches) {
        linkPageState().setPassword(props.password);
      }
    },
    onError: (err) => showHttpErrorToast(err, message("Could not create link"))
  });
}
function importIntoOwnDrive({ linkId, password }) {
  return apiClient.post(`shareable-links/${linkId}/import`, { password }).then((r) => r.data);
}
function useImportIntoOwnDrive() {
  const password = useLinkPageStore((s) => s.password);
  return useMutation({
    mutationFn: (props) => importIntoOwnDrive({ ...props, password }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DriveQueryKeys.fetchShareableLink()
      });
      toast(message("Item imported into your drive"));
    },
    onError: (err) => showHttpErrorToast(err, message("Could not create link"))
  });
}
function ShareableLinkPageActionButtons() {
  var _a2;
  const { link } = useShareableLinkPage();
  const { user, isLoggedIn } = useAuth();
  const { downloadUrl } = useFileEntryUrls(link == null ? void 0 : link.entry);
  const importIntoOwnDrive2 = useImportIntoOwnDrive();
  const alreadyImported = (_a2 = link == null ? void 0 : link.entry) == null ? void 0 : _a2.users.find((u) => u.id === (user == null ? void 0 : user.id));
  if (!(link == null ? void 0 : link.entry))
    return null;
  return /* @__PURE__ */ jsxs("div", { children: [
    link.allow_download && /* @__PURE__ */ jsx(DownloadButton, { downloadUrl }),
    !alreadyImported && isLoggedIn && link.allow_edit && /* @__PURE__ */ jsxs(
      MenuTrigger,
      {
        onItemSelected: (key) => {
          if (key === "import") {
            importIntoOwnDrive2.mutate({ linkId: link.id });
          } else if (key === "download") {
            if (downloadUrl) {
              downloadFileFromUrl(downloadUrl);
            }
          }
        },
        children: [
          /* @__PURE__ */ jsx(IconButton, { className: "ml-6", disabled: importIntoOwnDrive2.isPending, children: /* @__PURE__ */ jsx(KeyboardArrowDownIcon, {}) }),
          /* @__PURE__ */ jsxs(Menu, { children: [
            /* @__PURE__ */ jsx(Item, { value: "download", startIcon: /* @__PURE__ */ jsx(FileDownloadIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Download" }) }),
            /* @__PURE__ */ jsx(Item, { value: "import", startIcon: /* @__PURE__ */ jsx(ImportExportIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Save a copy to your own drive" }) })
          ] })
        ]
      }
    )
  ] });
}
function DownloadButton({ downloadUrl }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Download" }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        className: "md:hidden",
        onClick: () => {
          if (downloadUrl) {
            downloadFileFromUrl(downloadUrl);
          }
        },
        children: /* @__PURE__ */ jsx(FileDownloadIcon, {})
      }
    ) }),
    /* @__PURE__ */ jsx(
      Button,
      {
        className: "max-md:hidden",
        size: "sm",
        variant: "flat",
        color: "chip",
        startIcon: /* @__PURE__ */ jsx(FileDownloadIcon, {}),
        onClick: () => {
          if (downloadUrl) {
            downloadFileFromUrl(downloadUrl);
          }
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Download" })
      }
    )
  ] });
}
function ShareableLinkNavbar() {
  const { link } = useShareableLinkPage();
  const isMobile = useIsMobileMediaQuery();
  return /* @__PURE__ */ jsx(
    Navbar$1,
    {
      size: "md",
      color: "bg",
      className: "flex-shrink-0",
      rightChildren: (link == null ? void 0 : link.entry) && /* @__PURE__ */ jsx(ShareableLinkPageActionButtons, {}),
      menuPosition: "shareable-link-page",
      hideLogo: isMobile,
      children: (link == null ? void 0 : link.entry) && link.entry.type !== "folder" && /* @__PURE__ */ jsxs("div", { className: "fex-auto flex min-w-0 items-center gap-10", children: [
        /* @__PURE__ */ jsx(FileTypeIcon, { className: "flex-shrink-0", type: link.entry.type }),
        /* @__PURE__ */ jsx("div", { className: "flex-auto overflow-hidden overflow-ellipsis whitespace-nowrap font-medium", children: link.entry.name })
      ] })
    }
  );
}
function PasswordPage() {
  const { trans } = useTrans();
  const { hash } = useParams();
  const fieldLabel = trans({ message: "Password" });
  const [password, setPassword] = useState("");
  const checkPassword = useCheckLinkPassword();
  const linkHash = hash ? hash.split(":")[0] : null;
  const passwordIsInvalid = checkPassword.data && !checkPassword.data.matches;
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen flex-col bg-alt", children: [
    /* @__PURE__ */ jsx(ShareableLinkNavbar, {}),
    /* @__PURE__ */ jsx("div", { className: "mx-auto my-80 px-10 md:px-20", children: /* @__PURE__ */ jsxs("div", { className: "flex max-w-[560px] flex-col items-center gap-40 rounded border bg p-24 md:flex-row md:gap-14", children: [
      /* @__PURE__ */ jsx("div", { className: "h-132 w-[165px]", children: /* @__PURE__ */ jsx(SvgImage, { src: secureFilesSvg }) }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            checkPassword.mutate({
              linkHash,
              password
            });
          },
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: /* @__PURE__ */ jsx(Trans, { message: "The link you are trying to access is password protected." }) }),
            /* @__PURE__ */ jsx(
              TextField,
              {
                autoFocus: true,
                placeholder: fieldLabel,
                "aria-label": fieldLabel,
                className: "mb-20 mt-10",
                type: "password",
                value: password,
                required: true,
                errorMessage: passwordIsInvalid && /* @__PURE__ */ jsx(Trans, { message: "Password is not valid" }),
                onChange: (e) => {
                  setPassword(e.target.value);
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "flat",
                color: "primary",
                type: "submit",
                className: "w-full md:w-auto",
                disabled: checkPassword.isPending,
                children: /* @__PURE__ */ jsx(Trans, { message: "Enter" })
              }
            ) })
          ]
        }
      )
    ] }) })
  ] });
}
const BaseFileGridItem = React.forwardRef(
  ({ entry, className, isSelected, isMobileMode, footerAdornment, ...domProps }, ref) => {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ...domProps,
        ref,
        className: clsx(
          "shadow rounded border aspect-square flex flex-col grid-item transition-shadow-opacity select-none overflow-hidden outline-none dark:bg-alt",
          isSelected && "border-primary",
          className
        ),
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex-auto relative min-h-0", children: /* @__PURE__ */ jsx(
            FileThumbnail,
            {
              className: "h-full w-full",
              iconClassName: "block w-70 h-70 absolute m-auto inset-0",
              file: entry
            }
          ) }),
          /* @__PURE__ */ jsx(
            Footer$1,
            {
              entry,
              isSelected,
              isMobile: isMobileMode,
              adornment: footerAdornment
            }
          )
        ]
      }
    );
  }
);
function Footer$1({ entry, isSelected, isMobile, adornment }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "text-sm h-48 flex-shrink-0 flex items-center",
        isMobile ? "justify-between gap-10 pl-18 pr-2" : "justify-center px-16",
        isSelected && "bg-primary-light/20"
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "min-w-0 whitespace-nowrap overflow-hidden overflow-ellipsis", children: entry.name }),
        adornment
      ]
    }
  );
}
function FolderPreviewFileGrid({
  entries,
  onEntrySelected
}) {
  return /* @__PURE__ */ jsx("div", { className: "file-grid", children: entries.map((entry, index) => /* @__PURE__ */ jsx(
    BaseFileGridItem,
    {
      tabIndex: -1,
      className: "hover:shadow-md cursor-pointer bg",
      entry,
      onContextMenu: (e) => {
        e.preventDefault();
      },
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          onEntrySelected(entry, index);
        }
      },
      onClick: () => {
        onEntrySelected(entry, index);
      }
    },
    entry.id
  )) });
}
const stableArray = [];
enableMapSet();
const initialState = {
  uploadQueueIsOpen: false,
  contextMenuData: null,
  selectedEntries: /* @__PURE__ */ new Set(),
  entriesBeingDragged: [],
  activeActionDialog: null,
  sidebarExpandedKeys: [],
  viewMode: getFromLocalStorage(
    "drive.viewMode",
    ((_b = (_a = getBootstrapData().settings) == null ? void 0 : _a.drive) == null ? void 0 : _b.default_view) || "grid"
  ),
  sortDescriptor: {
    orderBy: "updated_at",
    orderDir: "desc"
  }
};
const useDriveStore = create()(
  immer((set, get) => ({
    ...initialState,
    setUploadQueueIsOpen: (isOpen) => {
      set((state) => {
        state.uploadQueueIsOpen = isOpen;
      });
    },
    setContextMenuData: (data) => {
      set((state) => {
        state.contextMenuData = data;
      });
    },
    setSortDescriptor: (value) => {
      set((state) => {
        var _a2;
        const activePageId = (_a2 = get().activePage) == null ? void 0 : _a2.uniqueId;
        if (activePageId) {
          setInLocalStorage("selectedSorting", {
            ...getFromLocalStorage("selectedSorting"),
            [activePageId]: value
          });
        }
        state.sortDescriptor = value;
      });
    },
    setActivePage: (value) => {
      set((state) => {
        var _a2;
        state.activePage = value;
        const storedDescriptor = (_a2 = getFromLocalStorage("selectedSorting")) == null ? void 0 : _a2[value.uniqueId];
        state.sortDescriptor = storedDescriptor ? storedDescriptor : value.sortDescriptor;
      });
    },
    setEntriesBeingDragged: (value) => {
      set((state) => {
        state.entriesBeingDragged = value;
      });
    },
    setActiveActionDialog: (name, entries = stableArray) => {
      set((state) => {
        const current = get().activeActionDialog;
        if ((current == null ? void 0 : current.name) !== name || current.entries !== entries) {
          state.activeActionDialog = name ? { name, entries } : null;
        }
      });
    },
    setViewMode: (mode) => {
      set((state) => {
        state.viewMode = mode;
        setInLocalStorage("drive.viewMode", mode);
      });
    },
    setSidebarExpandedKeys: (value) => set((state) => {
      state.sidebarExpandedKeys = value;
    }),
    expandSidebarItem: (key) => set((state) => {
      if (!state.sidebarExpandedKeys.includes(key)) {
        state.sidebarExpandedKeys.push(key);
      }
    }),
    collapseSidebarItem: (key) => set((state) => {
      const index = state.sidebarExpandedKeys.indexOf(key);
      if (index > -1) {
        state.sidebarExpandedKeys.splice(index, 1);
      }
    }),
    toggleSidebarItem: (key) => set((state) => {
      if (state.sidebarExpandedKeys.includes(key)) {
        state.expandSidebarItem(key);
      } else {
        state.collapseSidebarItem(key);
      }
    }),
    selectEntries: (entries, merge) => {
      set((state) => {
        if (!merge) {
          state.selectedEntries.clear();
        }
        entries.forEach((e) => e && state.selectedEntries.add(e));
      });
    },
    deselectEntries: (entries) => {
      set((state) => {
        if (!state.selectedEntries.size)
          return;
        if (entries === "all") {
          state.selectedEntries = /* @__PURE__ */ new Set();
        } else {
          entries.forEach((e) => state.selectedEntries.delete(e));
        }
      });
    },
    reset: () => {
      set(initialState);
    }
  }))
);
function driveState() {
  return useDriveStore.getState();
}
function useActiveDialogEntry() {
  const dialog = useDriveStore((s) => s.activeActionDialog);
  return dialog == null ? void 0 : dialog.entries[0];
}
function createShareableLink(entryId) {
  if (!entryId) {
    return Promise.reject(new Error("Invalid entry id"));
  }
  return apiClient.post(`file-entries/${entryId}/shareable-link`).then((response) => response.data);
}
function useCreateShareableLink() {
  return useMutation({
    mutationFn: ({ entryId }) => createShareableLink(entryId),
    onSuccess: (data, { entryId }) => {
      queryClient.setQueryData(
        DriveQueryKeys.fetchEntryShareableLink(entryId),
        data
      );
    },
    onError: (err) => showHttpErrorToast(err, message("Could not create link"))
  });
}
function addStarToEntries({ entryIds }) {
  return apiClient.post("file-entries/star", { entryIds }).then((response) => response.data);
}
function useAddStarToEntries() {
  return useMutation({
    mutationFn: (payload) => addStarToEntries(payload),
    onSuccess: (data, { entryIds }) => {
      invalidateEntryQueries();
      toast(
        message("Starred [one 1 item|other :count items]", {
          values: { count: entryIds.length }
        })
      );
    },
    onError: (err) => showHttpErrorToast(err, message("Could not star items"))
  });
}
function removeStarFromEntries({ entryIds }) {
  return apiClient.post("file-entries/unstar", { entryIds }).then((response) => response.data);
}
function useRemoveStarFromEntries() {
  return useMutation({
    mutationFn: (payload) => removeStarFromEntries(payload),
    onSuccess: (data, { entryIds }) => {
      invalidateEntryQueries();
      toast(
        message("Removed star from [one 1 item|other :count items]", {
          values: { count: entryIds.length }
        })
      );
    },
    onError: (err) => showHttpErrorToast(err, message("Could not remove star"))
  });
}
function duplicateEntries(payload) {
  return apiClient.post("file-entries/duplicate", payload).then((response) => response.data);
}
function useDuplicateEntries() {
  return useMutation({
    mutationFn: (payload) => {
      toast.loading(
        message("Duplicating [one 1 item|other :count items]...", {
          values: {
            count: payload.entryIds.length
          }
        }),
        { disableExitAnimation: true }
      );
      return duplicateEntries(payload);
    },
    onSuccess: (r, p) => {
      invalidateEntryQueries();
      queryClient.invalidateQueries({
        queryKey: DriveQueryKeys.fetchStorageSummary
      });
      toast(
        message("Duplicated [one 1 item|other :count items]", {
          values: { count: p.entryIds.length }
        }),
        { disableEnterAnimation: true }
      );
    },
    onError: (err) => showHttpErrorToast(err, message("Could not duplicate items"), null, {
      disableEnterAnimation: true
    })
  });
}
const addFilesSvg = "/assets/add-files-107c40dd.svg";
const timeManagement = "/assets/time-management-5219b76e.svg";
const fileSearching = "/assets/file-searching-49556098.svg";
const throwAwaySvg = "/assets/throw-away-389510cc.svg";
const lovingItSvg = "/assets/loving-it-585c130e.svg";
const shareSvg = "/assets/share-70babf29.svg";
const defaultSortDescriptor = {
  orderBy: "updated_at",
  orderDir: "desc"
};
function makeFolderPage(folder) {
  return {
    ...makePartialFolderPage(folder.hash),
    canUpload: folder.permissions["files.create"] || folder.permissions["files.update"],
    label: folder.name,
    folder
  };
}
function makePartialFolderPage(hash) {
  return {
    name: "folder",
    uniqueId: hash,
    label: "",
    path: getPathForFolder(hash),
    hasActions: true,
    canUpload: false,
    sortDescriptor: defaultSortDescriptor,
    isFolderPage: true,
    noContentMessage: () => ({
      title: message("Drop files or folders here"),
      description: message('Or use the "Upload" button'),
      image: addFilesSvg
    })
  };
}
function getPathForFolder(hash) {
  if (hash === "0") {
    return "/drive";
  }
  return `/drive/folders/${hash}`;
}
const rootFolder = getBootstrapData().rootFolder;
const RootFolderPage = {
  ...makeFolderPage(rootFolder),
  name: "home"
};
const RecentPage = {
  name: "recent",
  uniqueId: "recent",
  label: message("Recent"),
  path: "/drive/recent",
  disableSort: true,
  sortDescriptor: {
    orderBy: "created_at",
    orderDir: "desc"
  },
  queryParams: {
    recentOnly: true
  },
  noContentMessage: () => ({
    title: message("No recent entries"),
    description: message("You have not uploaded any files or folders yet"),
    image: timeManagement
  })
};
const SearchPage = {
  name: "search",
  uniqueId: "search",
  label: message("Search results"),
  path: "/drive/search",
  sortDescriptor: defaultSortDescriptor,
  noContentMessage: (isSearchingOrFiltering) => {
    if (isSearchingOrFiltering) {
      return {
        title: message("No matching results"),
        description: message("Try changing your search query or filters"),
        image: fileSearching
      };
    }
    return {
      title: message("Begin typing or select a filter to search"),
      description: message("Search for files, folders and other content"),
      image: fileSearching
    };
  }
};
const SharesPage = {
  name: "sharedWithMe",
  uniqueId: "sharedWithMe",
  label: message("Shared"),
  path: "/drive/shares",
  sortDescriptor: defaultSortDescriptor,
  queryParams: {
    sharedOnly: true
  },
  noContentMessage: () => ({
    title: message("Shared with me"),
    description: message("Files and folders other people have shared with you"),
    image: shareSvg
  })
};
const TrashPage = {
  name: "trash",
  uniqueId: "trash",
  label: message("Trash"),
  path: "/drive/trash",
  sortDescriptor: defaultSortDescriptor,
  hasActions: true,
  queryParams: {
    deletedOnly: true
  },
  noContentMessage: () => ({
    title: message("Trash is empty"),
    description: message(
      "There are no files or folders in your trash currently"
    ),
    image: throwAwaySvg
  })
};
const StarredPage = {
  name: "starred",
  uniqueId: "starred",
  label: message("Starred"),
  path: "/drive/starred",
  sortDescriptor: defaultSortDescriptor,
  queryParams: {
    starredOnly: true
  },
  noContentMessage: () => ({
    title: message("Nothing is starred"),
    description: message(
      "Add stars to files and folders that you want to easily find later"
    ),
    image: lovingItSvg
  })
};
const DRIVE_PAGES = [
  RootFolderPage,
  RecentPage,
  SearchPage,
  SharesPage,
  TrashPage,
  StarredPage
];
function deleteEntries(payload) {
  return apiClient.post("file-entries/delete", payload).then((response) => response.data);
}
function useDeleteEntries() {
  return useMutation({
    mutationFn: (payload) => {
      toast.loading(getLoaderMessage(payload), { disableExitAnimation: true });
      return deleteEntries(payload);
    },
    onSuccess: (r, { entryIds, emptyTrash, deleteForever }) => {
      invalidateEntryQueries();
      queryClient.invalidateQueries({
        queryKey: DriveQueryKeys.fetchStorageSummary
      });
      if (emptyTrash) {
        toast(message("Emptied trash"), { disableEnterAnimation: true });
      } else if (deleteForever) {
        toast(
          message("Permanently deleted [one 1 item|other :count items]", {
            values: { count: entryIds.length }
          }),
          { disableEnterAnimation: true }
        );
      } else {
        toast(
          message("Moved [one 1 item|other :count items] to trash", {
            values: { count: entryIds.length }
          }),
          { disableEnterAnimation: true }
        );
      }
    },
    onError: (err, { emptyTrash }) => {
      const backendError = getAxiosErrorMessage(err);
      if (backendError) {
        toast.danger(backendError, { disableEnterAnimation: true });
      } else if (emptyTrash) {
        toast.danger("could not empty trash", { disableEnterAnimation: true });
      } else {
        toast.danger("Could not delete items", { disableEnterAnimation: true });
      }
    }
  });
}
function getLoaderMessage(payload) {
  if (payload.emptyTrash) {
    return message("Emptying trash...");
  } else if (payload.deleteForever) {
    return message("Deleting files...");
  } else {
    return message("Moving to trash...");
  }
}
function useUnshareEntries() {
  return useMutation({
    mutationFn: (payload) => unshareEntries(payload),
    onSuccess: () => {
      return invalidateEntryQueries();
    }
  });
}
function unshareEntries({ entryIds, ...payload }) {
  return apiClient.post(`file-entries/${entryIds.join(",")}/unshare`, payload).then((response) => response.data);
}
function useRestoreEntries() {
  return useMutation({
    mutationFn: (payload) => restoreEntries(payload),
    onSuccess: (r, p) => {
      invalidateEntryQueries();
      toast(
        message("Restored [one 1 item|other :count items]", {
          values: { count: p.entryIds.length }
        })
      );
    },
    onError: (err) => showHttpErrorToast(err, message("Could not restore items"))
  });
}
function restoreEntries(payload) {
  return apiClient.post("file-entries/restore", payload).then((response) => response.data);
}
function useEntryActions(entries) {
  const preview = usePreviewAction(entries);
  const share = useShareAction(entries);
  const getLink = useGetLinkAction(entries);
  const addStar = useAddToStarredAction(entries);
  const removeStar = useRemoveFromStarred(entries);
  const moveTo = useMoveToAction(entries);
  const rename = useRenameAction(entries);
  const makeCopy = useMakeCopyAction(entries);
  const download = useDownloadEntriesAction(entries);
  const deleteAction = useDeleteEntriesAction(entries);
  const removeSharedEntries = useRemoveSharedEntriesAction(entries);
  const restoreEntries2 = useRestoreEntriesAction(entries);
  return [
    preview,
    share,
    getLink,
    addStar,
    removeStar,
    moveTo,
    rename,
    makeCopy,
    download,
    deleteAction,
    removeSharedEntries,
    restoreEntries2
  ].filter((action) => !!action);
}
function usePreviewAction(entries) {
  if (!entries.some((e) => e.type !== "folder"))
    return;
  return {
    label: message("Preview"),
    icon: RemoveRedEyeIcon,
    key: "preview",
    execute: () => {
      driveState().setActiveActionDialog("preview", entries);
    }
  };
}
function useShareAction(entries) {
  const activePage = useDriveStore((s) => s.activePage);
  if (entries.length > 1 || !entries.every((e) => e.permissions["files.update"]) || activePage === TrashPage)
    return;
  return {
    label: message("Share"),
    icon: PersonAddIcon,
    key: "share",
    execute: () => {
      driveState().setActiveActionDialog("share", entries);
    }
  };
}
function useGetLinkAction(entries) {
  const activePage = useDriveStore((s) => s.activePage);
  const createLink = useCreateShareableLink();
  if (entries.length > 1 || !entries.every((e) => e.permissions["files.update"]) || activePage === TrashPage) {
    return;
  }
  return {
    label: message("Get link"),
    icon: LinkIcon,
    key: "getLink",
    execute: () => {
      createLink.mutate({ entryId: entries[0].id });
      driveState().setActiveActionDialog("getLink", entries);
    }
  };
}
function useAddToStarredAction(entries) {
  const activePage = useDriveStore((s) => s.activePage);
  const starEntries = useAddStarToEntries();
  if (entries.every((e) => {
    var _a2;
    return (_a2 = e.tags) == null ? void 0 : _a2.find((tag) => tag.name === "starred");
  }) || !entries.every((e) => e.permissions["files.update"]) || activePage === TrashPage) {
    return;
  }
  return {
    label: message("Add to starred"),
    icon: StarIcon,
    key: "addToStarred",
    execute: () => {
      starEntries.mutate({ entryIds: entries.map((e) => e.id) });
      driveState().selectEntries([]);
    }
  };
}
function useRemoveFromStarred(entries) {
  const activePage = useDriveStore((s) => s.activePage);
  const removeStar = useRemoveStarFromEntries();
  if (!entries.every((e) => {
    var _a2;
    return (_a2 = e.tags) == null ? void 0 : _a2.find((tag) => tag.name === "starred");
  }) || activePage === TrashPage)
    return;
  return {
    label: message("Remove from starred"),
    icon: StarOutlineIcon,
    key: "removeFromStarred",
    execute: () => {
      removeStar.mutate({ entryIds: entries.map((e) => e.id) });
      driveState().selectEntries([]);
    }
  };
}
function useMoveToAction(entries) {
  const activePage = useDriveStore((s) => s.activePage);
  if (!entries.every((e) => e.permissions["files.update"]) || activePage === SharesPage || activePage === TrashPage) {
    return;
  }
  return {
    label: message("Move to"),
    icon: DriveFileMoveIcon,
    key: "moveTo",
    execute: () => {
      driveState().setActiveActionDialog("moveTo", entries);
    }
  };
}
function useRenameAction(entries) {
  const activePage = useDriveStore((s) => s.activePage);
  if (entries.length > 1 || !entries.every((e) => e.permissions["files.update"]) || activePage === TrashPage)
    return;
  return {
    label: message("Rename"),
    icon: DriveFileRenameOutlineIcon,
    key: "rename",
    execute: () => {
      driveState().setActiveActionDialog("rename", entries);
    }
  };
}
function useMakeCopyAction(entries) {
  const activePage = useDriveStore((s) => s.activePage);
  const duplicateEntries2 = useDuplicateEntries();
  if (entries.length > 1 || !entries.every((e) => e.permissions["files.update"]) || activePage === TrashPage) {
    return;
  }
  return {
    label: message("Make a copy"),
    icon: ContentCopyIcon,
    key: "makeCopy",
    execute: () => {
      var _a2;
      duplicateEntries2.mutate({
        entryIds: entries.map((e) => e.id),
        destinationId: (_a2 = activePage == null ? void 0 : activePage.folder) == null ? void 0 : _a2.id
      });
      driveState().selectEntries([]);
    }
  };
}
function useDownloadEntriesAction(entries) {
  const { downloadUrl } = useFileEntryUrls(entries[0], {
    downloadHashes: entries.map((e) => e.hash)
  });
  if (!entries.every((e) => e.permissions["files.download"]))
    return;
  return {
    label: message("Download"),
    icon: FileDownloadIcon,
    key: "download",
    execute: () => {
      if (downloadUrl) {
        downloadFileFromUrl(downloadUrl);
      }
      driveState().selectEntries([]);
    }
  };
}
function useDeleteEntriesAction(entries) {
  const deleteEntries2 = useDeleteEntries();
  const activePage = useDriveStore((s) => s.activePage);
  if (activePage === SharesPage || !entries.every((e) => e.permissions["files.delete"]))
    return;
  return {
    label: activePage === TrashPage ? message("Delete forever") : message("Remove"),
    icon: DeleteIcon,
    key: "delete",
    execute: () => {
      if (activePage === TrashPage) {
        driveState().setActiveActionDialog("confirmAndDeleteForever", entries);
      } else {
        deleteEntries2.mutate({
          entryIds: entries.map((e) => e.id),
          deleteForever: activePage === TrashPage
        });
        driveState().selectEntries([]);
      }
    }
  };
}
function useRestoreEntriesAction(entries) {
  const restoreEntries2 = useRestoreEntries();
  const activePage = useDriveStore((s) => s.activePage);
  if (activePage !== TrashPage || !entries.every((e) => e.permissions["files.delete"]))
    return;
  return {
    label: message("Restore"),
    icon: RestoreIcon,
    key: "restore",
    execute: () => {
      restoreEntries2.mutate({
        entryIds: entries.map((e) => e.id)
      });
      driveState().selectEntries([]);
    }
  };
}
function useRemoveSharedEntriesAction(entries) {
  const unshareEntries2 = useUnshareEntries();
  const activePage = useDriveStore((s) => s.activePage);
  if (activePage !== SharesPage)
    return;
  return {
    label: message("Remove"),
    icon: DeleteIcon,
    key: "removeSharedEntry",
    execute: () => {
      unshareEntries2.mutate(
        { entryIds: entries.map((e) => e.id), userId: "me" },
        {
          onSuccess: (r, p) => {
            toast(
              message("Removed [one 1 item|other {count} items]", {
                values: { count: p.entryIds.length }
              })
            );
          },
          onError: (err) => showHttpErrorToast(err, message("Could not remove items"))
        }
      );
      driveState().selectEntries([]);
    }
  };
}
function useStorageSummary() {
  return useQuery({
    queryKey: DriveQueryKeys.fetchStorageSummary,
    queryFn: fetchStorageSummary,
    select: formatResponse
  });
}
function fetchStorageSummary() {
  return apiClient.get(`user/space-usage`).then((response) => response.data);
}
function formatResponse(response) {
  const percentage = response.available === null ? 0 : response.used * 100 / response.available;
  return {
    usedFormatted: prettyBytes(response.used, 2),
    availableFormatted: prettyBytes(response.available, 0),
    percentage,
    used: response.used,
    available: response.available
  };
}
const EightMB = 8388608;
function useDriveUploadQueue() {
  const uploadMultiple = useFileUploadStore((s) => s.uploadMultiple);
  const { data: usage } = useStorageSummary();
  const { uploads } = useSettings();
  const maxFileSize = uploads.max_size || EightMB;
  const allowedFileTypes = uploads.allowed_extensions;
  const blockedFileTypes = uploads.blocked_extensions;
  const uploadFiles = useCallback(
    (files, options = {}) => {
      var _a2, _b2;
      if (!options.metadata) {
        options.metadata = {};
      }
      options.metadata.workspaceId = getActiveWorkspaceId();
      if (!options.metadata.parentId) {
        options.metadata.parentId = ((_b2 = (_a2 = driveState().activePage) == null ? void 0 : _a2.folder) == null ? void 0 : _b2.id) ?? null;
      }
      files = [...files].map((file) => {
        return file instanceof UploadedFile ? file : new UploadedFile(file);
      });
      if (usage) {
        const sizeOfFiles = files.reduce((sum, file) => sum + file.size, 0);
        const currentlyUsing = usage.used;
        const availableSpace = usage.available;
        if (sizeOfFiles + currentlyUsing > availableSpace) {
          toast.danger(
            message(
              "You have exhausted your allowed space of :space. Delete some files or upgrade your plan.",
              { values: { space: usage.availableFormatted } }
            ),
            { action: { action: "/pricing", label: message("Upgrade") } }
          );
          return;
        }
      }
      uploadMultiple(files, {
        ...options,
        restrictions: {
          maxFileSize,
          allowedFileTypes,
          blockedFileTypes
        },
        onSuccess: (entry, file) => {
          var _a3;
          (_a3 = options == null ? void 0 : options.onSuccess) == null ? void 0 : _a3.call(options, entry, file);
          invalidateEntryQueries();
          queryClient.invalidateQueries({
            queryKey: DriveQueryKeys.fetchStorageSummary
          });
        }
      });
      driveState().setUploadQueueIsOpen(true);
    },
    [uploadMultiple, allowedFileTypes, blockedFileTypes, maxFileSize, usage]
  );
  return { uploadFiles };
}
function useDrivePageActions(page) {
  const newFolder = useNewFolderAction(page);
  const uploadFiles = useUploadFilesAction(page);
  const uploadFolder = useUploadFolderAction(page);
  const emptyTrash = useEmptyTrashAction();
  return [newFolder, uploadFiles, uploadFolder, emptyTrash].filter(
    (action) => !!action
  );
}
function useNewFolderAction(page) {
  if (!page.folder || !page.folder.permissions["files.update"])
    return;
  return {
    label: message("New folder"),
    icon: CreateNewFolderIcon,
    key: "newFolder",
    execute: () => {
      if (page.folder) {
        driveState().setActiveActionDialog("newFolder", [page.folder]);
      }
    }
  };
}
function useUploadFilesAction(page) {
  const { uploadFiles } = useDriveUploadQueue();
  if (!page.folder || !page.folder.permissions["files.update"])
    return;
  return {
    label: message("Upload files"),
    icon: FileUploadIcon,
    key: "uploadFiles",
    execute: async () => {
      uploadFiles(await openUploadWindow({ multiple: true }));
    }
  };
}
function useUploadFolderAction(page) {
  const { uploadFiles } = useDriveUploadQueue();
  if (!page.folder || !page.folder.permissions["files.update"])
    return;
  return {
    label: message("Upload folder"),
    icon: DriveFolderUploadIcon,
    key: "uploadFolder",
    execute: async () => {
      uploadFiles(await openUploadWindow({ directory: true }));
    }
  };
}
function useEmptyTrashAction(page) {
  const deleteEntries2 = useDeleteEntries();
  const activePage = useDriveStore((s) => s.activePage);
  if (activePage !== TrashPage)
    return;
  return {
    label: message("Empty trash"),
    icon: DeleteForeverIcon,
    key: "emptyTrash",
    execute: () => {
      deleteEntries2.mutate({ entryIds: [], emptyTrash: true });
      driveState().selectEntries([]);
    }
  };
}
function EntryActionMenuTrigger({ children, entries, page }) {
  if ((page == null ? void 0 : page.name) === RootFolderPage.name) {
    return /* @__PURE__ */ jsx(PageMenu, { page: RootFolderPage, children });
  }
  if (page === TrashPage) {
    return /* @__PURE__ */ jsx(PageMenu, { page: TrashPage, children });
  }
  if (page == null ? void 0 : page.folder) {
    return /* @__PURE__ */ jsx(EntriesMenu, { entries: [page.folder], children });
  }
  if (entries == null ? void 0 : entries.length) {
    return /* @__PURE__ */ jsx(EntriesMenu, { entries, children });
  }
  return null;
}
function EntriesMenu({ entries, children }) {
  const actions = useEntryActions(entries);
  return /* @__PURE__ */ jsx(BaseMenu, { actions, children });
}
function PageMenu({ page, children }) {
  const actions = useDrivePageActions(page);
  return /* @__PURE__ */ jsx(BaseMenu, { actions, children });
}
function BaseMenu({ actions, children }) {
  return /* @__PURE__ */ jsxs(MenuTrigger, { children: [
    children,
    /* @__PURE__ */ jsx(Menu, { children: actions.map((action) => {
      return /* @__PURE__ */ jsx(
        Item,
        {
          onSelected: () => {
            action.execute();
          },
          value: action.key,
          startIcon: createElement(action.icon),
          children: /* @__PURE__ */ jsx(Trans, { ...action.label })
        },
        action.key
      );
    }) })
  ] });
}
const formatFileSize = memoize((bytes) => {
  return prettyBytes(bytes);
});
const fileTableColumns = [
  {
    key: "name",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Name" }),
    visibleInMode: "all",
    width: "flex-3 min-w-200",
    body: (entry) => /* @__PURE__ */ jsx(FileNameColumn, { entry })
  },
  {
    key: "updated_at",
    allowsSorting: true,
    maxWidth: "max-w-184",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Last modified" }),
    body: (user) => /* @__PURE__ */ jsx(FormattedDate, { date: user.updated_at })
  },
  {
    key: "file_size",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Size" }),
    maxWidth: "max-w-144",
    body: (entry) => formatFileSize(entry.file_size) ?? "-"
  },
  {
    key: "actions",
    hideHeader: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    align: "end",
    width: "w-42 flex-shrink-0",
    visibleInMode: "all",
    body: (entry) => /* @__PURE__ */ jsx(ActionsColumn, { entry })
  }
];
function FileNameColumn({ entry }) {
  const { isCollapsedMode } = useContext(TableContext);
  const sizeClassName = isCollapsedMode ? "w-30 h-30" : "w-24 h-24";
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-14", children: [
    /* @__PURE__ */ jsx(
      FileThumbnail,
      {
        className: clsx("rounded", sizeClassName),
        iconClassName: sizeClassName,
        file: entry
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden overflow-ellipsis", children: entry.name }),
      isCollapsedMode && /* @__PURE__ */ jsxs("div", { className: "text-muted text-xs flex items-center mt-4", children: [
        /* @__PURE__ */ jsx(FormattedDate, { date: entry.updated_at }),
        /* @__PURE__ */ jsx("div", { children: "·" }),
        /* @__PURE__ */ jsx("div", { children: formatFileSize(entry.file_size) })
      ] })
    ] })
  ] });
}
function ActionsColumn({ entry }) {
  const { selectedRows } = useContext(TableContext);
  return selectedRows.length ? /* @__PURE__ */ jsx(
    Checkbox,
    {
      className: "block mr-8",
      checked: selectedRows.includes(entry.id)
    }
  ) : /* @__PURE__ */ jsx(EntryActionMenuTrigger, { entries: [entry], children: /* @__PURE__ */ jsx(IconButton, { className: "text-muted", children: /* @__PURE__ */ jsx(MoreVertIcon, {}) }) });
}
const mobileColumns = fileTableColumns.filter(
  (config) => config.key !== "updated_at"
);
function FolderPreviewFileTable({
  entries,
  onEntrySelected
}) {
  const sortDescriptor = useLinkPageStore((s) => s.activeSort);
  const isMobile = useIsMobileMediaQuery();
  return /* @__PURE__ */ jsx(
    Table,
    {
      columns: isMobile ? mobileColumns : fileTableColumns,
      data: entries,
      sortDescriptor,
      onSortChange: (value) => {
        linkPageState().setActiveSort(value);
      },
      onAction: (item, index) => {
        onEntrySelected(item, index);
      },
      enableSelection: false
    }
  );
}
function buildFolderHash(link, folderHash) {
  var _a2;
  let hash = link.hash;
  if (folderHash && ((_a2 = link.entry) == null ? void 0 : _a2.hash) !== folderHash) {
    hash = `${hash}:${folderHash}`;
  }
  return hash;
}
function useNavigateToSubfolder() {
  const { link } = useShareableLinkPage();
  const navigate = useNavigate();
  return (hash) => {
    if (!link)
      return;
    navigate(`/drive/s/${buildFolderHash(link, hash)}`);
  };
}
function FolderPreviewFileView({ className }) {
  const { pathname } = useLocation();
  const navigateToSubfolder = useNavigateToSubfolder();
  const [activePreviewIndex, setActivePreviewIndex] = useState();
  const viewMode = useLinkPageStore((s) => s.viewMode);
  const sentinelRef = useRef(null);
  const {
    link,
    entries,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isPlaceholderData
  } = useShareableLinkPage();
  useEffect(() => {
    setActivePreviewIndex(void 0);
  }, [pathname]);
  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl)
      return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(sentinelEl);
    return () => {
      observer.unobserve(sentinelEl);
    };
  }, [hasNextPage, fetchNextPage]);
  if (!link || isPlaceholderData) {
    return /* @__PURE__ */ jsx("div", { className: clsx("flex justify-center", className), children: /* @__PURE__ */ jsx(ProgressCircle, { isIndeterminate: true }) });
  }
  const handlePreview = (entry, index) => {
    if (entry.type === "folder") {
      navigateToSubfolder(entry.hash);
    } else {
      setActivePreviewIndex(index);
    }
  };
  const folderEntries = entries || [];
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: clsx(
          "file-grid-container flex-auto overflow-auto px-14 pb-14 md:px-24 md:pb-24",
          className
        ),
        children: [
          /* @__PURE__ */ jsx(AdHost, { slot: "file-preview", className: "mb-40" }),
          viewMode === "grid" ? /* @__PURE__ */ jsx(
            FolderPreviewFileGrid,
            {
              entries: folderEntries,
              onEntrySelected: handlePreview
            }
          ) : /* @__PURE__ */ jsx(
            FolderPreviewFileTable,
            {
              entries: folderEntries,
              onEntrySelected: handlePreview
            }
          ),
          /* @__PURE__ */ jsx("span", { ref: sentinelRef, "aria-hidden": true }),
          /* @__PURE__ */ jsx(AnimatePresence, { children: isFetchingNextPage && /* @__PURE__ */ jsx(
            m.div,
            {
              className: "mt-24 flex w-full justify-center",
              ...opacityAnimation,
              children: /* @__PURE__ */ jsx(ProgressCircle, { isIndeterminate: true, "aria-label": "loading" })
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      DialogTrigger,
      {
        type: "modal",
        isOpen: activePreviewIndex != void 0,
        onClose: () => setActivePreviewIndex(void 0),
        children: /* @__PURE__ */ jsx(
          FilePreviewDialog,
          {
            entries: folderEntries,
            defaultActiveIndex: activePreviewIndex,
            allowDownload: link.allow_download
          }
        )
      }
    )
  ] });
}
function DashboardContentHeader({
  children,
  className
}) {
  return /* @__PURE__ */ jsx("div", { className: clsx(className, "dashboard-grid-header"), children });
}
function useFolderPath({ hash, params, isEnabled = true }) {
  return useQuery({
    queryKey: DriveQueryKeys.fetchFolderPath(hash, params),
    queryFn: () => fetchFolderPath(hash, params),
    enabled: !!hash && isEnabled
  });
}
function fetchFolderPath(hash, params) {
  return apiClient.get(`folders/${hash}/path`, { params }).then((response) => response.data);
}
function FolderPreviewBreadcrumb({ className, folder, link }) {
  const navigateToSubfolder = useNavigateToSubfolder();
  const password = useLinkPageStore((s) => s.password);
  const query = useFolderPath({
    hash: folder == null ? void 0 : folder.hash,
    params: {
      shareable_link: link.id,
      password
    }
  });
  let content;
  if (query.isLoading) {
    content = null;
  } else {
    const items = [];
    if (query.data) {
      query.data.path.forEach((parent) => {
        items.push({
          folder: parent,
          label: /* @__PURE__ */ jsx(Fragment$1, { children: parent.name })
        });
      });
    }
    content = /* @__PURE__ */ jsx(Breadcrumb, { size: "lg", isNavigation: true, children: items.map((item) => {
      return /* @__PURE__ */ jsx(
        BreadcrumbItem,
        {
          onSelected: () => {
            navigateToSubfolder(item.folder.hash);
          },
          children: item.label
        },
        item.folder.hash
      );
    }) });
  }
  return /* @__PURE__ */ jsx("div", { className: clsx("h-36 flex-shrink-0", className), children: content });
}
const AVAILABLE_SORTS = [
  { id: "file_size", label: message("Size") },
  { id: "name", label: message("Name") },
  { id: "updated_at", label: message("Last modified") },
  { id: "created_at", label: message("Upload date") },
  { id: "type", label: message("Type") },
  { id: "extension", label: message("Extension") }
];
function EntriesSortButton({
  descriptor,
  onChange,
  isDisabled = false
}) {
  const column = descriptor.orderBy;
  const direction = descriptor.orderDir;
  const sort = AVAILABLE_SORTS.find((s) => s.id === column);
  return /* @__PURE__ */ jsxs(
    MenuTrigger,
    {
      showCheckmark: true,
      selectionMode: "multiple",
      selectedValue: [direction || "desc", column || ""],
      onItemSelected: (key) => {
        if (key === "asc" || key === "desc") {
          onChange({
            orderBy: column,
            orderDir: key
          });
        } else {
          onChange({
            orderBy: key,
            orderDir: direction
          });
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "text-muted",
            variant: "text",
            size: "sm",
            startIcon: /* @__PURE__ */ jsx(SortIcon, {}),
            disabled: isDisabled,
            children: sort ? /* @__PURE__ */ jsx(Trans, { ...sort.label }) : null
          }
        ),
        /* @__PURE__ */ jsxs(Menu, { children: [
          /* @__PURE__ */ jsxs(Section, { label: /* @__PURE__ */ jsx(Trans, { message: "Direction" }), children: [
            /* @__PURE__ */ jsx(Item, { value: "asc", children: /* @__PURE__ */ jsx(Trans, { message: "Ascending" }) }),
            /* @__PURE__ */ jsx(Item, { value: "desc", children: /* @__PURE__ */ jsx(Trans, { message: "Descending" }) })
          ] }),
          /* @__PURE__ */ jsx(Section, { label: /* @__PURE__ */ jsx(Trans, { message: "Sort By" }), children: AVAILABLE_SORTS.map((item) => /* @__PURE__ */ jsx(Item, { value: item.id, children: /* @__PURE__ */ jsx(Trans, { ...item.label }) }, item.id)) })
        ] })
      ]
    }
  );
}
function FolderPreviewHeader() {
  const activeSort = useLinkPageStore((s) => s.activeSort);
  const { link, isFetching } = useShareableLinkPage();
  const hasEntry = link && link.entry;
  return /* @__PURE__ */ jsxs("div", { className: "md:flex-row flex flex-col md:items-center gap-14 justify-between p-14 md:p-24 md:h-90", children: [
    hasEntry && /* @__PURE__ */ jsx(
      FolderPreviewBreadcrumb,
      {
        link,
        folder: link.entry,
        className: "flex-auto"
      }
    ),
    hasEntry && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between md:justify-start text-muted", children: [
      /* @__PURE__ */ jsx(
        EntriesSortButton,
        {
          isDisabled: isFetching,
          descriptor: activeSort,
          onChange: (value) => {
            linkPageState().setActiveSort(value);
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "md:border-l md:pl-10 ml-10", children: /* @__PURE__ */ jsx(
        IconButton,
        {
          onClick: () => {
            linkPageState().setViewMode(
              linkPageState().viewMode === "grid" ? "list" : "grid"
            );
          },
          children: /* @__PURE__ */ jsx(GridViewIcon, {})
        }
      ) })
    ] })
  ] });
}
function FolderPreview() {
  const { entries, isFetched } = useShareableLinkPage();
  const showEmptyMessage = isFetched && !(entries == null ? void 0 : entries.length);
  return /* @__PURE__ */ jsxs(DashboardLayout, { name: "folder-preview", children: [
    /* @__PURE__ */ jsx(
      DashboardNavbar,
      {
        hideToggleButton: true,
        rightChildren: /* @__PURE__ */ jsx(ShareableLinkPageActionButtons, {}),
        color: "bg"
      }
    ),
    /* @__PURE__ */ jsx(DashboardContentHeader, { children: /* @__PURE__ */ jsx(FolderPreviewHeader, {}) }),
    /* @__PURE__ */ jsx(FileUploadProvider, { children: /* @__PURE__ */ jsx(DashboardContent, { children: showEmptyMessage ? /* @__PURE__ */ jsx(EmptyMessage, {}) : /* @__PURE__ */ jsx(FolderPreviewFileView, {}) }) })
  ] });
}
function EmptyMessage({ className }) {
  return /* @__PURE__ */ jsx(
    IllustratedMessage,
    {
      className: clsx(className, "mt-80"),
      image: /* @__PURE__ */ jsx(SvgImage, { src: shareSvg }),
      title: /* @__PURE__ */ jsx(Trans, { message: "Folder is empty" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "No files have been uploaded to this folder yet" })
    }
  );
}
function ShareableLinkPageFilePreview() {
  const { link } = useShareableLinkPage();
  if (!(link == null ? void 0 : link.entry))
    return null;
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen flex-col bg-alt", children: [
    /* @__PURE__ */ jsx(ShareableLinkNavbar, {}),
    /* @__PURE__ */ jsx(AdHost, { slot: "file-preview", className: "mx-auto mt-24" }),
    /* @__PURE__ */ jsx(
      FilePreviewContainer,
      {
        entries: [link.entry],
        showHeader: false,
        allowDownload: link.allow_download
      }
    )
  ] });
}
function ShareableLinkPage() {
  var _a2;
  const { status, link } = useShareableLinkPage();
  const { trans } = useTrans();
  const isPasswordProtected = useLinkPageStore((s) => s.isPasswordProtected);
  const password = useLinkPageStore((s) => s.password);
  let content;
  if (status === "pending") {
    content = /* @__PURE__ */ jsx("div", { className: "flex h-screen flex-auto items-center justify-center", children: /* @__PURE__ */ jsx(
      ProgressCircle,
      {
        "aria-label": trans({ message: "Loading link" }),
        isIndeterminate: true
      }
    ) });
  } else if (!link && !isPasswordProtected) {
    return /* @__PURE__ */ jsx(NotFoundPage, {});
  } else if (isPasswordProtected && !password) {
    content = /* @__PURE__ */ jsx(PasswordPage, {});
  } else if (((_a2 = link == null ? void 0 : link.entry) == null ? void 0 : _a2.type) === "folder") {
    content = /* @__PURE__ */ jsx(FolderPreview, {});
  } else {
    content = /* @__PURE__ */ jsx(ShareableLinkPageFilePreview, {});
  }
  return /* @__PURE__ */ jsx(FileEntryUrlsContext.Provider, { value: { shareable_link: link == null ? void 0 : link.id, password }, children: content });
}
function Meter(props) {
  return /* @__PURE__ */ jsx(ProgressBarBase, { ...props, role: "meter progressbar" });
}
function StorageMeter() {
  const { isLoading, data } = useStorageSummary();
  const label = /* @__PURE__ */ jsx("span", { className: clsx("whitespace-nowrap", isLoading && "invisible"), children: /* @__PURE__ */ jsx(
    Trans,
    {
      message: ":used of :available used",
      values: {
        used: data == null ? void 0 : data.usedFormatted,
        available: data == null ? void 0 : data.availableFormatted
      }
    }
  ) });
  return /* @__PURE__ */ jsxs("div", { className: "pl-24 pt-24 mt-24 border-t flex items-start gap-16", children: [
    /* @__PURE__ */ jsx(StorageIcon, { className: "icon-md -mt-4" }),
    /* @__PURE__ */ jsx(
      Meter,
      {
        className: "flex-auto max-w-144",
        size: "xs",
        value: data == null ? void 0 : data.percentage,
        label,
        showValueLabel: false,
        labelPosition: "bottom"
      }
    )
  ] });
}
function useCreateWorkspace(form) {
  return useMutation({
    mutationFn: (props) => createWorkspace(props),
    onSuccess: () => {
      toast(message("Created workspace"));
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueryKeys.fetchUserWorkspaces
      });
    },
    onError: (r) => onFormQueryError(r, form)
  });
}
function createWorkspace(props) {
  return apiClient.post("workspace", props).then((r) => r.data);
}
function NewWorkspaceDialog() {
  const form = useForm();
  const { formId, close } = useDialogContext();
  const createWorkspace2 = useCreateWorkspace(form);
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Create workspace" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      Form,
      {
        form,
        id: formId,
        onSubmit: () => {
          createWorkspace2.mutate(form.getValues(), {
            onSuccess: (response) => {
              close(response.workspace.id);
            }
          });
        },
        children: /* @__PURE__ */ jsx(
          FormTextField,
          {
            name: "name",
            autoFocus: true,
            label: /* @__PURE__ */ jsx(Trans, { message: "Workspace name" }),
            minLength: 3,
            required: true
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "text", onClick: close, children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          type: "submit",
          form: formId,
          disabled: createWorkspace2.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Create" })
        }
      )
    ] })
  ] });
}
function fetchWorkspaceWithMembers(workspaceId) {
  return apiClient.get(`workspace/${workspaceId}`).then((response) => response.data);
}
function useWorkspaceWithMembers(workspaceId) {
  return useQuery({
    queryKey: WorkspaceQueryKeys.workspaceWithMembers(workspaceId),
    queryFn: () => fetchWorkspaceWithMembers(workspaceId)
  });
}
function InviteMembers({ workspaceId, ...other }) {
  return apiClient.post(`workspace/${workspaceId}/invite`, other).then((r) => r.data);
}
function useInviteMembers() {
  return useMutation({
    mutationFn: (props) => InviteMembers(props),
    onSuccess: (response, props) => {
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueryKeys.workspaceWithMembers(props.workspaceId)
      });
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function ResendInvite({
  workspaceId,
  inviteId,
  ...other
}) {
  return apiClient.post(`workspace/${workspaceId}/${inviteId}/resend`, other).then((r) => r.data);
}
function useResendInvite() {
  return useMutation({
    mutationFn: (props) => ResendInvite(props),
    onSuccess: () => {
      toast("Invite sent");
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
const matcher = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
function isEmail(string) {
  if (!string)
    return false;
  if (string.length > 320)
    return false;
  return matcher.test(string);
}
function ChangeRole({ workspaceId, member, ...other }) {
  const modelType = member.model_type;
  const memberId = member.model_type === "invite" ? member.id : member.member_id;
  return apiClient.post(
    `workspace/${workspaceId}/${modelType}/${memberId}/change-role`,
    other
  ).then((r) => r.data);
}
function useChangeRole() {
  return useMutation({
    mutationFn: (props) => ChangeRole(props),
    onSuccess: (response, props) => {
      toast(message("Role changed"));
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueryKeys.workspaceWithMembers(props.workspaceId)
      });
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function removeMember({
  workspaceId,
  memberId,
  memberType
}) {
  const endpoint = memberType === "invite" ? `workspace/invite/${memberId}` : `workspace/${workspaceId}/member/${memberId}`;
  return apiClient.delete(endpoint).then((r) => r.data);
}
function useRemoveMember() {
  const { workspaceId, setWorkspaceId } = useActiveWorkspaceId();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (props) => removeMember(props),
    onSuccess: (response, props) => {
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueryKeys.fetchUserWorkspaces
      });
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueryKeys.workspaceWithMembers(props.workspaceId)
      });
      if (props.memberId === (user == null ? void 0 : user.id) && workspaceId === props.workspaceId) {
        setWorkspaceId(PersonalWorkspace.id);
      }
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function LeaveWorkspaceConfirmation({ onConfirm, isLoading }) {
  return /* @__PURE__ */ jsx(
    ConfirmationDialog,
    {
      isDanger: true,
      title: /* @__PURE__ */ jsx(Trans, { message: "Leave workspace" }),
      isLoading,
      onConfirm,
      body: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Trans, { message: "Are you sure you want to leave this workspace?" }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 font-semibold", children: /* @__PURE__ */ jsx(Trans, { message: "All resources you've created in the workspace will be transferred to workspace owner." }) })
      ] }),
      confirm: /* @__PURE__ */ jsx(Trans, { message: "Leave" })
    }
  );
}
function WorkspaceMembersDialog({
  workspace
}) {
  const { data, isLoading } = useWorkspaceWithMembers(workspace.id);
  return /* @__PURE__ */ jsxs(Dialog, { size: "lg", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Manage workspace members" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: isLoading ? /* @__PURE__ */ jsx("div", { className: "flex min-h-[238px] items-center justify-center", children: /* @__PURE__ */ jsx(ProgressCircle, { isIndeterminate: true, "aria-label": "Loading workspace..." }) }) : /* @__PURE__ */ jsx(Manager, { workspace: data.workspace }) })
  ] });
}
function Manager({ workspace }) {
  const { user } = useAuth();
  const can = usePermissions(workspace);
  const members = [
    ...workspace.members || [],
    ...workspace.invites || []
  ];
  const shouldHideOtherMembers = !can.update && !can.delete;
  return /* @__PURE__ */ jsxs("div", { children: [
    can.invite && /* @__PURE__ */ jsx(InviteChipField, { workspace }),
    /* @__PURE__ */ jsxs("div", { className: "mb-14 flex items-center gap-10 text-base", children: [
      /* @__PURE__ */ jsx(GroupIcon, { className: "icon-sm" }),
      /* @__PURE__ */ jsx(
        Trans,
        {
          message: "Members of `:workspace`",
          values: { workspace: workspace.name }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(AnimatePresence, { initial: false, children: [
      members.map((member) => {
        if (shouldHideOtherMembers && member.id !== (user == null ? void 0 : user.id)) {
          return null;
        }
        return /* @__PURE__ */ jsx(
          MemberListItem$1,
          {
            workspace,
            member
          },
          `${member.model_type}.${member.id}`
        );
      }),
      shouldHideOtherMembers && /* @__PURE__ */ jsx("div", { className: "text-muted", children: /* @__PURE__ */ jsx(
        Trans,
        {
          message: "And [one one other member|:count other members]",
          values: { count: members.length }
        }
      ) })
    ] })
  ] });
}
function MemberListItem$1({ workspace, member }) {
  return /* @__PURE__ */ jsxs(
    m.div,
    {
      initial: { x: "-100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: 0 },
      transition: { type: "tween", duration: 0.125 },
      className: "mb-20 flex items-start gap-14 text-sm",
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            className: "h-36 w-36 flex-shrink-0 rounded",
            src: member.avatar,
            alt: ""
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-auto items-center justify-between gap-14 md:flex", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-10 overflow-hidden md:mb-0 md:mr-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start gap-6", children: [
              /* @__PURE__ */ jsx("div", { className: "overflow-hidden text-ellipsis whitespace-nowrap", children: member.display_name }),
              /* @__PURE__ */ jsx(MemberDisplayNameAppend, { workspace, member })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-muted", children: member.email })
          ] }),
          /* @__PURE__ */ jsx(MemberActions, { workspace, member })
        ] })
      ]
    },
    `${member.model_type}.${member.id}`
  );
}
function usePermissions(workspace) {
  var _a2;
  const { user: authUser } = useAuth();
  const response = { update: false, invite: false, delete: false };
  const permissions = ["update", "invite", "delete"];
  const authMember = (_a2 = workspace.members) == null ? void 0 : _a2.find((mb) => mb.id === (authUser == null ? void 0 : authUser.id));
  if (authMember) {
    permissions.forEach((permission) => {
      var _a3;
      response[permission] = authMember.is_owner || !!((_a3 = authMember.permissions) == null ? void 0 : _a3.find(
        (p) => p.name === `workspace_members.${permission}`
      ));
    });
  }
  return response;
}
function MemberActions({ workspace, member }) {
  const [selectedRole, setSelectedRole] = useState(member.role_id);
  const changeRole = useChangeRole();
  const { user } = useAuth();
  const can = usePermissions(workspace);
  const isOwner = member.model_type === "member" && member.is_owner;
  const isCurrentUser = member.model_type === "member" && (user == null ? void 0 : user.id) === member.id;
  const roleSelector = !can.update || isOwner || isCurrentUser ? /* @__PURE__ */ jsx("div", { className: "ml-auto text-muted first:capitalize", children: /* @__PURE__ */ jsx(Trans, { message: member.role_name }) }) : /* @__PURE__ */ jsx(
    RoleMenuTrigger,
    {
      className: "ml-auto flex-shrink-0",
      size: "xs",
      value: selectedRole,
      isDisabled: changeRole.isPending,
      onChange: (roleId) => {
        setSelectedRole(roleId);
        changeRole.mutate({
          roleId,
          workspaceId: workspace.id,
          member
        });
      }
    }
  );
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    roleSelector,
    !isOwner && (isCurrentUser || can.delete) && /* @__PURE__ */ jsx(
      RemoveMemberButton,
      {
        type: isCurrentUser ? "leave" : "remove",
        member,
        workspace
      }
    )
  ] });
}
function InviteChipField({ workspace }) {
  const { trans } = useTrans();
  const [chips, setChips] = useState([]);
  const allEmailsValid = chips.every((chip) => !chip.invalid);
  const displayWith = (chip) => chip.description || chip.name;
  const [selectedRole, setSelectedRole] = useState();
  const inviteMembers = useInviteMembers();
  const { data } = useValueLists(["workspaceRoles"]);
  useEffect(() => {
    var _a2;
    if (!selectedRole && ((_a2 = data == null ? void 0 : data.workspaceRoles) == null ? void 0 : _a2.length)) {
      setSelectedRole(data.workspaceRoles[0].id);
    }
  }, [data, selectedRole]);
  return /* @__PURE__ */ jsxs("div", { className: "mb-30", children: [
    /* @__PURE__ */ jsx(
      ChipField,
      {
        value: chips,
        onChange: setChips,
        displayWith,
        validateWith: (chip) => {
          const invalid = !isEmail(chip.description);
          return {
            ...chip,
            invalid,
            errorMessage: invalid ? trans({ message: "Not a valid email" }) : void 0
          };
        },
        placeholder: trans({ message: "Enter email addresses" }),
        label: /* @__PURE__ */ jsx(Trans, { message: "Invite people" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-14 flex items-center justify-between gap-14", children: [
      /* @__PURE__ */ jsx(RoleMenuTrigger, { onChange: setSelectedRole, value: selectedRole }),
      chips.length && selectedRole ? /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          size: "sm",
          disabled: inviteMembers.isPending || !allEmailsValid,
          onClick: () => {
            inviteMembers.mutate(
              {
                emails: chips.map((c) => displayWith(c)),
                roleId: selectedRole,
                workspaceId: workspace.id
              },
              {
                onSuccess: () => {
                  setChips([]);
                }
              }
            );
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Invite" })
        }
      ) : null
    ] })
  ] });
}
function RemoveMemberButton({
  member,
  workspace,
  type
}) {
  const removeMember2 = useRemoveMember();
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (isConfirmed) => {
        if (isConfirmed) {
          removeMember2.mutate({
            workspaceId: workspace.id,
            memberId: member.id,
            memberType: member.model_type
          });
          if (type === "leave") {
            close();
            toast(message("Left workspace"));
          }
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          IconButton,
          {
            size: "md",
            className: "flex-shrink-0 text-muted",
            disabled: removeMember2.isPending,
            children: type === "leave" ? /* @__PURE__ */ jsx(ExitToAppIcon, {}) : /* @__PURE__ */ jsx(CloseIcon, {})
          }
        ),
        type === "leave" ? /* @__PURE__ */ jsx(LeaveWorkspaceConfirmation, {}) : /* @__PURE__ */ jsx(RemoveMemberConfirmation, { member })
      ]
    }
  );
}
function RemoveMemberConfirmation({ member }) {
  return /* @__PURE__ */ jsx(
    ConfirmationDialog,
    {
      isDanger: true,
      title: /* @__PURE__ */ jsx(Trans, { message: "Remove member" }),
      body: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          Trans,
          {
            message: "Are you sure you want to remove `:name`?",
            values: { name: member.display_name }
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-8 font-semibold", children: /* @__PURE__ */ jsx(
          Trans,
          {
            message: "All workspace resources created by `:name` will be transferred to workspace owner.",
            values: {
              name: member.display_name
            }
          }
        ) })
      ] }),
      confirm: /* @__PURE__ */ jsx(Trans, { message: "Remove" })
    }
  );
}
function RoleMenuTrigger({
  value,
  onChange,
  size = "xs",
  className,
  isDisabled
}) {
  var _a2;
  const { data } = useValueLists(["workspaceRoles"]);
  const role = (_a2 = data == null ? void 0 : data.workspaceRoles) == null ? void 0 : _a2.find((r) => r.id === value);
  if (!value || !role || !(data == null ? void 0 : data.workspaceRoles))
    return null;
  return /* @__PURE__ */ jsxs(
    MenuTrigger,
    {
      selectionMode: "single",
      selectedValue: value,
      onSelectionChange: (newValue) => {
        onChange(newValue);
      },
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            className,
            size,
            variant: "flat",
            color: "chip",
            disabled: isDisabled,
            endIcon: /* @__PURE__ */ jsx(ArrowDropDownIcon, {}),
            children: /* @__PURE__ */ jsx(Trans, { message: role.name })
          }
        ),
        /* @__PURE__ */ jsx(Menu, { children: data.workspaceRoles.map((r) => /* @__PURE__ */ jsx(Item, { value: r.id, description: r.description, children: /* @__PURE__ */ jsx(Trans, { message: r.name }) }, r.id)) })
      ]
    }
  );
}
function MemberDisplayNameAppend({
  member,
  workspace
}) {
  const { user } = useAuth();
  const can = usePermissions(workspace);
  if ((user == null ? void 0 : user.id) === member.id) {
    return /* @__PURE__ */ jsxs("div", { className: "font-medium", children: [
      "(",
      /* @__PURE__ */ jsx(Trans, { message: "You" }),
      ")"
    ] });
  }
  if (member.model_type === "invite") {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { children: "·" }),
      /* @__PURE__ */ jsx("div", { className: "font-medium", children: /* @__PURE__ */ jsx(Trans, { message: "Invited" }) }),
      can.invite ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
        /* @__PURE__ */ jsx("div", { children: "·" }),
        /* @__PURE__ */ jsx(ResendInviteDialogTrigger, { member, workspace })
      ] }) : null
    ] });
  }
  return null;
}
function ResendInviteDialogTrigger({
  member,
  workspace
}) {
  const resendInvite = useResendInvite();
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (isConfirmed) => {
        if (isConfirmed) {
          resendInvite.mutate({
            workspaceId: workspace.id,
            inviteId: member.id
          });
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "link",
            size: "sm",
            color: "primary",
            disabled: resendInvite.isPending,
            children: /* @__PURE__ */ jsx(Trans, { message: "Resend invite" })
          }
        ),
        /* @__PURE__ */ jsx(
          ConfirmationDialog,
          {
            title: /* @__PURE__ */ jsx(Trans, { message: "Resend invite" }),
            body: /* @__PURE__ */ jsx(Trans, { message: "Are you sure you want to send this invite again?" }),
            confirm: /* @__PURE__ */ jsx(Trans, { message: "Send" })
          }
        )
      ]
    }
  );
}
function updateWorkspace({
  id,
  ...props
}) {
  return apiClient.put(`workspace/${id}`, props).then((r) => r.data);
}
function useUpdateWorkspace(form) {
  const { close } = useDialogContext();
  return useMutation({
    mutationFn: (props) => updateWorkspace(props),
    onSuccess: (response) => {
      close();
      toast(message("Updated workspace"));
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueryKeys.fetchUserWorkspaces
      });
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueryKeys.workspaceWithMembers(
          response.workspace.id
        )
      });
    },
    onError: (r) => onFormQueryError(r, form)
  });
}
function RenameWorkspaceDialog({ workspace }) {
  const form = useForm({
    defaultValues: { id: workspace.id, name: workspace.name }
  });
  const { formId, close } = useDialogContext();
  const updateWorkspace2 = useUpdateWorkspace(form);
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Rename workspace" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      Form,
      {
        form,
        id: formId,
        onSubmit: () => {
          updateWorkspace2.mutate(form.getValues());
        },
        children: /* @__PURE__ */ jsx(
          FormTextField,
          {
            name: "name",
            autoFocus: true,
            label: /* @__PURE__ */ jsx(Trans, { message: "Name" }),
            minLength: 3,
            required: true
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "text", onClick: close, children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          type: "submit",
          form: formId,
          disabled: updateWorkspace2.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Rename" })
        }
      )
    ] })
  ] });
}
function deleteWorkspace({ id }) {
  return apiClient.delete(`workspace/${id}`).then((r) => r.data);
}
function useDeleteWorkspace() {
  const { workspaceId, setWorkspaceId } = useActiveWorkspaceId();
  return useMutation({
    mutationFn: (props) => deleteWorkspace(props),
    onSuccess: (r, payload) => {
      toast(message("Deleted workspace"));
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueryKeys.fetchUserWorkspaces
      });
      queryClient.invalidateQueries({
        queryKey: WorkspaceQueryKeys.workspaceWithMembers(payload.id)
      });
      if (workspaceId === payload.id) {
        setWorkspaceId(PersonalWorkspace.id);
      }
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function PolicyFailMessage({
  resourceName,
  className,
  size = "md",
  color = "bgAlt",
  reason = "overQuota",
  ...other
}) {
  const message2 = other.message ?? /* @__PURE__ */ jsx(MessageText, { resourceName, reason });
  return /* @__PURE__ */ jsx(
    SectionHelper,
    {
      color,
      size,
      className,
      description: message2
    }
  );
}
function MessageText({ resourceName, reason }) {
  const { billing } = useSettings();
  if (reason === "noWorkspacePermission") {
    return /* @__PURE__ */ jsx(
      Trans,
      {
        message: "You can't create new :name in this workspace.",
        values: { name: resourceName }
      }
    );
  }
  const upgradeMsgValues = {
    name: resourceName,
    a: (text) => /* @__PURE__ */ jsx(Link, { className: LinkStyle, to: "/pricing", children: text })
  };
  if (reason === "overQuota" && billing.enable) {
    return /* @__PURE__ */ jsx(
      Trans,
      {
        message: "Your plan is at its maximum number of :name allowed. <a>Upgrade to add more.</a>",
        values: upgradeMsgValues
      }
    );
  }
  if (reason === "noPermission" && billing.enable) {
    return /* @__PURE__ */ jsx(
      Trans,
      {
        message: "To unlock ability to create :name. <a>Upgrade your plan.</a>",
        values: upgradeMsgValues
      }
    );
  }
  return /* @__PURE__ */ jsx(Trans, { message: "You don't have permissions to create :name." });
}
function WorkspaceSelector({
  onChange,
  className,
  trigger,
  placement = "top"
}) {
  const { data: workspaces, isFetched, isFetching } = useUserWorkspaces();
  const { setWorkspaceId } = useActiveWorkspaceId();
  const activeWorkspace = useActiveWorkspace();
  const [selectorIsOpen, setSelectorIsOpen] = useState(false);
  const { hasPermission } = useAuth();
  useEffect(() => {
    if (isFetched && !isFetching && !activeWorkspace) {
      setWorkspaceId(PersonalWorkspace.id);
    }
  }, [activeWorkspace, workspaces, setWorkspaceId, isFetched, isFetching]);
  if (
    // if we have a custom trigger, leave rendering up to the customer trigger
    !trigger && (!activeWorkspace || !hasPermission("workspaces.create") && (workspaces == null ? void 0 : workspaces.length) === 1)
  ) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "popover",
      placement,
      isOpen: selectorIsOpen,
      onClose: () => {
        setSelectorIsOpen(false);
      },
      children: [
        trigger ? cloneElement(trigger, {
          onClick: () => setSelectorIsOpen(!selectorIsOpen)
        }) : /* @__PURE__ */ jsx(
          DefaultTrigger,
          {
            onClick: () => setSelectorIsOpen(!selectorIsOpen),
            workspace: activeWorkspace,
            className
          }
        ),
        /* @__PURE__ */ jsx(Dialog, { size: "min-w-320", children: /* @__PURE__ */ jsxs(DialogBody, { padding: "p-10", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-16 border-b pb-10", children: workspaces == null ? void 0 : workspaces.map((workspace) => /* @__PURE__ */ jsx(
            WorkspaceItem,
            {
              workspace,
              setSelectorIsOpen,
              onChange
            },
            workspace.id
          )) }),
          /* @__PURE__ */ jsx("div", { className: "mb-4 px-4 text-center", children: /* @__PURE__ */ jsx(
            CreateWorkspaceButton,
            {
              onClick: () => setSelectorIsOpen(false),
              onCreated: (id) => onChange == null ? void 0 : onChange(id),
              workspaceCount: workspaces ? workspaces.length - 1 : 0
            }
          ) })
        ] }) })
      ]
    }
  ) });
}
function CreateWorkspaceButton({
  onClick,
  onCreated,
  workspaceCount
}) {
  const { setWorkspaceId } = useActiveWorkspaceId();
  const { checkOverQuotaOrNoPermission } = useAuth();
  const { overQuotaOrNoPermission } = checkOverQuotaOrNoPermission(
    "workspaces.create",
    "count",
    workspaceCount
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        disabled: overQuotaOrNoPermission,
        onClick: async (e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
          const workspaceId = await openDialog(NewWorkspaceDialog);
          if (workspaceId) {
            setWorkspaceId(workspaceId);
            onCreated == null ? void 0 : onCreated(workspaceId);
          }
        },
        variant: "outline",
        startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
        color: "primary",
        className: "h-40 w-full",
        children: /* @__PURE__ */ jsx(Trans, { message: "Create new workspace" })
      }
    ),
    overQuotaOrNoPermission && /* @__PURE__ */ jsx(
      PolicyFailMessage,
      {
        size: "sm",
        className: "mt-12 max-w-288",
        resourceName: /* @__PURE__ */ jsx(Trans, { message: "worksapces" })
      }
    )
  ] });
}
const DefaultTrigger = forwardRef(
  ({ workspace, className, onClick, ...other }, ref) => {
    return /* @__PURE__ */ jsxs(
      ButtonBase,
      {
        ref,
        onClick,
        className: clsx(
          "flex items-center gap-10 rounded ring-inset hover:bg-hover focus-visible:ring-2",
          className
        ),
        ...other,
        children: [
          /* @__PURE__ */ jsxs("span", { className: "mr-auto block flex-auto overflow-hidden text-left", children: [
            /* @__PURE__ */ jsx("span", { className: "block overflow-hidden overflow-ellipsis text-sm font-medium text-main", children: workspace.default ? /* @__PURE__ */ jsx(Trans, { message: workspace.name }) : workspace.name }),
            /* @__PURE__ */ jsx("span", { className: "block text-xs text-muted", children: workspace.default ? /* @__PURE__ */ jsx(Trans, { message: "Personal workspace" }) : /* @__PURE__ */ jsx(
              Trans,
              {
                message: ":count members",
                values: { count: workspace.members_count }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx(UnfoldMoreIcon, { className: "shrink-0 icon-md" })
        ]
      }
    );
  }
);
function WorkspaceItem({
  workspace,
  onChange,
  setSelectorIsOpen
}) {
  const { workspaceId, setWorkspaceId } = useActiveWorkspaceId();
  const isActive = workspaceId === workspace.id;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: () => {
        setWorkspaceId(workspace.id);
        onChange == null ? void 0 : onChange(workspace.id);
        setSelectorIsOpen(false);
      },
      className: clsx(
        "mb-4 flex cursor-pointer items-center gap-12 rounded-lg p-10 text-left",
        isActive && "bg-primary/5",
        !isActive && "hover:bg-hover"
      ),
      children: [
        /* @__PURE__ */ jsx(
          CheckIcon,
          {
            size: "sm",
            className: clsx("flex-shrink-0 text-primary", !isActive && "invisible")
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex-auto", children: [
          /* @__PURE__ */ jsx("div", { className: clsx("text-sm", isActive && "font-semibold"), children: workspace.name }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted", children: workspace.default ? /* @__PURE__ */ jsx(Trans, { message: "Personal workspace" }) : /* @__PURE__ */ jsx(
            Trans,
            {
              message: ":count members",
              values: { count: workspace.members_count }
            }
          ) })
        ] }),
        workspace.id !== 0 && /* @__PURE__ */ jsx(
          ManageButton,
          {
            setSelectorIsOpen,
            workspace,
            onChange
          }
        )
      ]
    }
  );
}
function LeaveWorkspaceDialog({
  workspace,
  onChange
}) {
  const removeMember2 = useRemoveMember();
  const { user } = useAuth();
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsx(
    LeaveWorkspaceConfirmation,
    {
      isLoading: removeMember2.isPending,
      onConfirm: () => {
        removeMember2.mutate(
          {
            workspaceId: workspace.id,
            memberId: user.id,
            memberType: "member"
          },
          {
            onSuccess: () => {
              close();
              onChange == null ? void 0 : onChange(PersonalWorkspace.id);
            }
          }
        );
      }
    }
  );
}
function DeleteWorkspaceConfirmation({
  workspace,
  onChange
}) {
  const deleteWorkspace2 = useDeleteWorkspace();
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsx(
    ConfirmationDialog,
    {
      isDanger: true,
      title: /* @__PURE__ */ jsx(Trans, { message: "Delete workspace" }),
      body: /* @__PURE__ */ jsx(
        Trans,
        {
          message: "Are you sure you want to delete “:name“?",
          values: { name: workspace.name }
        }
      ),
      confirm: /* @__PURE__ */ jsx(Trans, { message: "Delete" }),
      isLoading: deleteWorkspace2.isPending,
      onConfirm: () => {
        deleteWorkspace2.mutate(
          { id: workspace.id },
          {
            onSuccess: () => {
              close();
              onChange == null ? void 0 : onChange(PersonalWorkspace.id);
            }
          }
        );
      }
    }
  );
}
function ManageButton({
  setSelectorIsOpen,
  workspace,
  onChange
}) {
  const { user } = useAuth();
  return /* @__PURE__ */ jsxs(MenuTrigger, { onItemSelected: () => setSelectorIsOpen(false), children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        color: "primary",
        size: "xs",
        variant: "outline",
        endIcon: /* @__PURE__ */ jsx(KeyboardArrowDownIcon, {}),
        children: /* @__PURE__ */ jsx(Trans, { message: "Manage" })
      }
    ),
    /* @__PURE__ */ jsxs(Menu, { children: [
      /* @__PURE__ */ jsx(
        Item,
        {
          onClick: (e) => {
            e.stopPropagation();
            openDialog(WorkspaceMembersDialog, { workspace });
          },
          value: "workspaceMembers",
          startIcon: /* @__PURE__ */ jsx(PersonAddIcon, {}),
          children: /* @__PURE__ */ jsx(Trans, { message: "Members" })
        }
      ),
      workspace.owner_id === (user == null ? void 0 : user.id) && /* @__PURE__ */ jsx(
        Item,
        {
          onClick: (e) => {
            e.stopPropagation();
            openDialog(RenameWorkspaceDialog, { workspace });
          },
          value: "updateWorkspace",
          startIcon: /* @__PURE__ */ jsx(EditIcon, {}),
          children: /* @__PURE__ */ jsx(Trans, { message: "Rename" })
        }
      ),
      workspace.owner_id !== (user == null ? void 0 : user.id) && /* @__PURE__ */ jsx(
        Item,
        {
          onClick: (e) => {
            e.stopPropagation();
            openDialog(LeaveWorkspaceDialog, { workspace, onChange });
          },
          value: "leaveWorkspace",
          startIcon: /* @__PURE__ */ jsx(ExitToAppIcon, {}),
          children: /* @__PURE__ */ jsx(Trans, { message: "Leave" })
        }
      ),
      workspace.owner_id === (user == null ? void 0 : user.id) && /* @__PURE__ */ jsx(
        Item,
        {
          onClick: (e) => {
            e.stopPropagation();
            openDialog(DeleteWorkspaceConfirmation, { workspace, onChange });
          },
          value: "deleteWorkspace",
          startIcon: /* @__PURE__ */ jsx(DeleteIcon, {}),
          children: /* @__PURE__ */ jsx(Trans, { message: "Delete" })
        }
      )
    ] })
  ] });
}
var MenuPositions = /* @__PURE__ */ ((MenuPositions2) => {
  MenuPositions2["DriveSidebar"] = "drive-sidebar";
  return MenuPositions2;
})(MenuPositions || {});
function fetchUserFolders(params) {
  return apiClient.get(`users/${params.userId}/folders`, { params }).then((response) => response.data);
}
function useFolders() {
  const { user } = useAuth();
  const { workspaceId } = useActiveWorkspaceId();
  const params = {
    userId: user.id,
    workspaceId
  };
  return useQuery({
    queryKey: DriveQueryKeys.fetchUserFolders(params),
    queryFn: () => fetchUserFolders(params),
    enabled: !!user
  });
}
function useMoveEntries() {
  return useMutation({
    mutationFn: (payload) => {
      toast.loading(
        message("Moving [one 1 item|other :count items]...", {
          values: {
            count: payload.entryIds.length
          }
        }),
        { disableExitAnimation: true }
      );
      return moveEntries(payload);
    },
    onSuccess: (r, p) => {
      invalidateEntryQueries();
      toast(
        message('Moved [one 1 item|other :count items] to ":destination"', {
          values: {
            count: p.entryIds.length,
            destination: (r.destination || RootFolderPage.folder).name
          }
        }),
        { disableEnterAnimation: true }
      );
    },
    onError: (err) => showHttpErrorToast(err, message("Could not move items"), null, {
      disableEnterAnimation: true
    })
  });
}
function moveEntries(payload) {
  payload.destinationId = !payload.destinationId ? null : payload.destinationId;
  return apiClient.post("file-entries/move", payload).then((response) => response.data);
}
function canMoveEntriesInto(targets, destination) {
  if (destination.type !== "folder")
    return false;
  return targets.every((target) => {
    if (!target)
      return false;
    if (destination.id === target.parent_id || // root folder check
    !target.parent_id && destination.id === 0) {
      return false;
    }
    return !destinationIsInTarget(destination, target);
  });
}
function destinationIsInTarget(destination, target) {
  const destinationPath = (destination.path || "").split("/");
  const targetPath = (target.path || "").split("/");
  return targetPath.every((part, index) => {
    return destinationPath[index] === part;
  });
}
function useFolderDropAction(folder) {
  const moveEntries2 = useMoveEntries();
  const { uploadFiles } = useDriveUploadQueue();
  const onDrop = async (target) => {
    if (folder.type !== "folder")
      return;
    if (target.type === "nativeFile") {
      uploadFiles(await target.getData(), {
        metadata: { parentId: folder.id }
      });
    } else if (target.type === "fileEntry") {
      const entries = target.getData();
      if ((entries == null ? void 0 : entries.length) && canMoveEntriesInto(entries, folder)) {
        moveEntries2.mutate({
          destinationId: folder.id,
          entryIds: entries.map((e) => e.id)
        });
        driveState().deselectEntries("all");
      }
    }
  };
  return { onDrop };
}
function folderAcceptsDrop(target, entry) {
  if (target.type === "fileEntry") {
    const entries = target.getData();
    return canMoveEntriesInto(entries, entry);
  }
  return true;
}
function makeFolderTreeDragId(entry) {
  return `${entry.id}-tree`;
}
function isFolderTreeDragId(id) {
  return `${id}`.endsWith("-tree");
}
function useSidebarTreeDropTarget({ folder, ref }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { onDrop } = useFolderDropAction(folder);
  const dropProps = useDroppable({
    id: makeFolderTreeDragId(folder),
    ref,
    types: ["fileEntry", "nativeFile"],
    acceptsDrop: (draggable) => folderAcceptsDrop(draggable, folder),
    onDragEnter: (draggable) => {
      if (folderAcceptsDrop(draggable, folder)) {
        setIsDragOver(true);
      }
    },
    onDragLeave: () => {
      setIsDragOver(false);
    },
    onDropActivate: () => {
      if (!driveState().sidebarExpandedKeys.includes(folder.id)) {
        driveState().setSidebarExpandedKeys([
          ...driveState().sidebarExpandedKeys,
          folder.id
        ]);
      }
    },
    onDrop
  });
  return { ...dropProps, isDragOver };
}
const TreeContext = createContext(null);
function renderTree({
  nodes,
  itemRenderer,
  parentNode,
  level
}) {
  return nodes.map((node, index) => {
    return cloneElement(itemRenderer(node), {
      level: level == void 0 ? 0 : level + 1,
      index,
      node,
      parentNode,
      key: node.id,
      itemRenderer
    });
  });
}
const TreeLabel = forwardRef(
  ({ icon, label, level = 0, node, className, ...domProps }, ref) => {
    const { expandedKeys, setExpandedKeys, selectedKeys, setSelectedKeys } = useContext(TreeContext);
    const isExpanded = expandedKeys.includes(node.id);
    const isSelected = selectedKeys.includes(node.id);
    const handleExpandIconClick = (e) => {
      e.stopPropagation();
      const index = expandedKeys.indexOf(node.id);
      const newExpandedKeys = [...expandedKeys];
      if (index > -1) {
        newExpandedKeys.splice(index, 1);
      } else {
        newExpandedKeys.push(node.id);
      }
      setExpandedKeys(newExpandedKeys);
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ...domProps,
        ref,
        onClick: (e) => {
          e.stopPropagation();
          setSelectedKeys([node.id]);
        },
        className: clsx(
          "flex flex-nowrap whitespace-nowrap items-center gap-4 py-6 rounded header cursor-pointer overflow-hidden text-ellipsis tree-label",
          className,
          isSelected && "bg-primary/selected text-primary font-bold",
          !isSelected && "hover:bg-hover"
        ),
        children: [
          level > 0 && /* @__PURE__ */ jsx("div", { className: "flex", children: Array.from({ length: level }).map((_, i) => {
            return /* @__PURE__ */ jsx("div", { className: "w-24 h-24" }, i);
          }) }),
          /* @__PURE__ */ jsx("div", { onClick: handleExpandIconClick, children: /* @__PURE__ */ jsx(
            ArrowRightIcon,
            {
              className: clsx(
                "icon-sm cursor-default transition-transform",
                isExpanded && "rotate-90"
              )
            }
          ) }),
          icon,
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden text-ellipsis pr-6", children: label })
        ]
      }
    );
  }
);
TreeLabel.displayName = "TreeLabel";
function TreeItem({
  label,
  icon,
  node,
  level,
  index,
  itemRenderer,
  labelRef,
  labelClassName,
  className,
  parentNode,
  ...domProps
}) {
  const focusManager = useFocusManager();
  const {
    expandedKeys,
    selectedKeys,
    focusedNode,
    setFocusedNode,
    setExpandedKeys,
    setSelectedKeys
  } = useContext(TreeContext);
  useEffect(() => {
    return () => {
      if (focusedNode === (node == null ? void 0 : node.id)) {
        setFocusedNode(void 0);
      }
    };
  }, [focusedNode, node == null ? void 0 : node.id, setFocusedNode]);
  if (!node || !itemRenderer)
    return null;
  const hasChildren = node.children.length;
  const isExpanded = hasChildren && expandedKeys.includes(node.id);
  const isSelected = selectedKeys.includes(node.id);
  const isFirstNode = level === 0 && index === 0;
  const isFocused = focusedNode == void 0 ? isFirstNode : focusedNode === node.id;
  const onKeyDown = (e) => {
    var _a2, _b2;
    if (focusedNode == null)
      return;
    switch (e.key) {
      case "Enter":
      case " ":
        e.stopPropagation();
        e.preventDefault();
        setSelectedKeys([focusedNode]);
        break;
      case "ArrowRight":
        e.stopPropagation();
        e.preventDefault();
        if (!hasChildren)
          return;
        if (!isExpanded) {
          setExpandedKeys([...expandedKeys, focusedNode]);
        } else {
          focusManager == null ? void 0 : focusManager.focusNext();
        }
        break;
      case "ArrowLeft":
        e.stopPropagation();
        e.preventDefault();
        if (isExpanded) {
          const index2 = expandedKeys.indexOf(focusedNode);
          const newKeys = [...expandedKeys];
          newKeys.splice(index2, 1);
          setExpandedKeys(newKeys);
        } else if (parentNode) {
          const parentEl = (_b2 = (_a2 = document.activeElement) == null ? void 0 : _a2.parentElement) == null ? void 0 : _b2.closest("[tabindex]");
          if (parentEl) {
            parentEl.focus();
          }
        }
        break;
      case "ArrowDown":
        e.stopPropagation();
        e.preventDefault();
        focusManager == null ? void 0 : focusManager.focusNext();
        break;
      case "ArrowUp":
        e.stopPropagation();
        e.preventDefault();
        focusManager == null ? void 0 : focusManager.focusPrevious();
        break;
      case "Home":
        e.stopPropagation();
        e.preventDefault();
        focusManager == null ? void 0 : focusManager.focusFirst();
        break;
      case "End":
        e.stopPropagation();
        e.preventDefault();
        focusManager == null ? void 0 : focusManager.focusLast();
        break;
      case "*":
        e.stopPropagation();
        e.preventDefault();
        if (parentNode == null ? void 0 : parentNode.children) {
          const newKeys = [...expandedKeys];
          parentNode.children.forEach((childNode) => {
            if (childNode.children.length && !expandedKeys.includes(childNode.id)) {
              newKeys.push(childNode.id);
            }
          });
          if (newKeys.length !== expandedKeys.length) {
            setExpandedKeys(newKeys);
          }
        }
        break;
    }
  };
  return /* @__PURE__ */ jsxs(
    "li",
    {
      role: "treeitem",
      "aria-expanded": isExpanded ? "true" : "false",
      "aria-selected": isSelected,
      tabIndex: isFocused ? 0 : -1,
      onKeyDown: createEventHandler(onKeyDown),
      onFocus: (e) => {
        e.stopPropagation();
        setFocusedNode(node.id);
      },
      onBlur: (e) => {
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocusedNode(void 0);
        }
      },
      className: clsx(
        "outline-none",
        // focus direct .tree-label child when this element has :focus-visible
        "[&>.tree-label]:focus-visible:ring [&>.tree-label]:focus-visible:ring-2 [&>.tree-label]:focus-visible:ring-inset",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          TreeLabel,
          {
            ref: labelRef,
            className: labelClassName,
            node,
            level,
            label,
            icon,
            ...domProps
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: isExpanded ? /* @__PURE__ */ jsx(
          m.ul,
          {
            role: "group",
            initial: "closed",
            animate: "open",
            exit: "closed",
            variants: {
              open: { opacity: 1, height: "auto" },
              closed: { opacity: 0, height: 0, overflow: "hidden" }
            },
            children: renderTree({
              nodes: node.children,
              parentNode: node,
              itemRenderer,
              level
            })
          },
          `${node.id}-group`
        ) : null })
      ]
    }
  );
}
function Tree({
  children,
  nodes,
  ...props
}) {
  const [expandedKeys, setExpandedKeys] = useControlledState(
    props.expandedKeys,
    props.defaultSelectedKeys,
    props.onExpandedKeysChange
  );
  const [selectedKeys, setSelectedKeys] = useControlledState(
    props.selectedKeys,
    props.defaultSelectedKeys,
    props.onSelectedKeysChange
  );
  const [focusedNode, setFocusedNode] = useState();
  const value = {
    expandedKeys,
    setExpandedKeys,
    selectedKeys,
    setSelectedKeys,
    focusedNode,
    setFocusedNode
  };
  return /* @__PURE__ */ jsx(TreeContext.Provider, { value, children: /* @__PURE__ */ jsx(FocusScope, { children: /* @__PURE__ */ jsx(TreeRoot, { nodes, itemRenderer: children }) }) });
}
function TreeRoot(props) {
  return /* @__PURE__ */ jsx("ul", { className: "overflow-hidden text-sm", role: "tree", children: renderTree(props) });
}
function FolderTree() {
  const navigate = useNavigate$1();
  const { data } = useFolders();
  const expandedKeys = useDriveStore((s) => s.sidebarExpandedKeys);
  const activePage = useDriveStore((s) => s.activePage);
  let selectedKeys = [];
  if (activePage == null ? void 0 : activePage.isFolderPage) {
    selectedKeys = activePage.folder ? [activePage.folder.id] : [];
  }
  const tree = useMemo(() => {
    const folders = arrayToTree((data == null ? void 0 : data.folders) || [], {
      parentId: "parent_id",
      dataField: null
    });
    const rootFolder2 = {
      ...RootFolderPage.folder,
      children: folders
    };
    return [rootFolder2];
  }, [data == null ? void 0 : data.folders]);
  return /* @__PURE__ */ jsx(
    Tree,
    {
      nodes: tree,
      expandedKeys,
      onExpandedKeysChange: (keys) => {
        driveState().setSidebarExpandedKeys(keys);
      },
      selectedKeys,
      onSelectedKeysChange: ([id]) => {
        const entryHash = findHash(id, tree);
        if (entryHash) {
          navigate(getPathForFolder(entryHash));
        } else {
          navigate(RootFolderPage.path);
        }
      },
      children: () => /* @__PURE__ */ jsx(FolderTreeItem, {})
    }
  );
}
function FolderTreeItem(props) {
  const { node } = props;
  const labelRef = useRef(null);
  const isRootFolder = node.id === 0;
  const isDragging = useDriveStore(
    (s) => s.entriesBeingDragged.includes(node.id)
  );
  const { draggableProps } = useDraggable({
    type: "fileEntry",
    id: makeFolderTreeDragId(node),
    ref: labelRef,
    disabled: isRootFolder,
    hidePreview: true,
    onDragStart: (e, draggable) => {
      const d = draggable;
      driveState().setEntriesBeingDragged(d.getData().map((e2) => e2.id));
      driveState().selectEntries([]);
    },
    onDragEnd: () => {
      driveState().setEntriesBeingDragged([]);
    },
    getData: () => [node]
  });
  const { droppableProps, isDragOver } = useSidebarTreeDropTarget({
    folder: node,
    ref: labelRef
  });
  return /* @__PURE__ */ jsx(
    TreeItem,
    {
      ...mergeProps(draggableProps, droppableProps, props),
      onContextMenu: (e) => {
        e.preventDefault();
        e.stopPropagation();
        driveState().deselectEntries("all");
        driveState().setContextMenuData({
          x: e.clientX,
          y: e.clientY,
          entry: node
        });
      },
      labelRef,
      className: isRootFolder ? "focus-visible:ring-2" : void 0,
      labelClassName: clsx(
        isDragOver && "bg-primary/selected ring ring-2 ring-inset ring-primary",
        isDragging && "opacity-30",
        isRootFolder && "h-40"
      ),
      icon: isRootFolder ? /* @__PURE__ */ jsx(BackupIcon, { size: "md", className: "mr-6" }) : /* @__PURE__ */ jsx(FolderIcon, { size: "sm", className: "mr-4" }),
      label: node.name
    }
  );
}
const findHash = (id, nodes) => {
  for (const item of nodes) {
    if (item.id === id) {
      return item.hash;
    } else if (item.children) {
      const hash = findHash(id, item.children);
      if (hash) {
        return hash;
      }
    }
  }
};
function SidebarMenu() {
  useActiveWorkspaceId();
  return /* @__PURE__ */ jsxs("div", { className: "text-muted mt-26 px-12", children: [
    /* @__PURE__ */ jsx(FolderTree, {}),
    /* @__PURE__ */ jsx(
      CustomMenu,
      {
        menu: MenuPositions.DriveSidebar,
        orientation: "vertical",
        gap: "gap-0",
        children: (item) => {
          if (item.action === "/drive/trash") {
            return /* @__PURE__ */ jsx(TrashMenuItem, { item }, item.id);
          }
          return /* @__PURE__ */ jsx(MenuItem, { item }, item.id);
        }
      }
    )
  ] });
}
const MenuItem = forwardRef(
  ({ item, className, ...domProps }, ref) => {
    return /* @__PURE__ */ jsx(
      CustomMenuItem,
      {
        className: ({ isActive }) => clsx(
          className,
          "h-40 w-full my-4 px-24 rounded",
          isActive ? "text-primary font-bold bg-primary/selected cursor-default" : "hover:bg-hover"
        ),
        item,
        ref,
        ...domProps
      }
    );
  }
);
function TrashMenuItem({ item }) {
  const deleteEntries2 = useDeleteEntries();
  const [isDragOver, setIsDragOver] = useState(false);
  const ref = useRef(null);
  const { droppableProps } = useDroppable({
    id: "trash",
    types: ["fileEntry"],
    ref,
    onDragEnter: () => {
      setIsDragOver(true);
    },
    onDragLeave: () => {
      setIsDragOver(false);
    },
    onDrop: (draggable) => {
      const entryIds = draggable.getData().map((e) => e.id);
      deleteEntries2.mutate({ entryIds, deleteForever: false });
    }
  });
  return /* @__PURE__ */ jsx(
    MenuItem,
    {
      className: clsx(isDragOver && "bg-primary/selected"),
      ref,
      ...droppableProps,
      item
    }
  );
}
function CreateNewButton({ isCompact, className }) {
  const activePage = useDriveStore((s) => s.activePage);
  const { uploadFiles } = useDriveUploadQueue();
  const button = isCompact ? /* @__PURE__ */ jsx(IconButton, { size: "md", children: /* @__PURE__ */ jsx(AddIcon, {}) }) : /* @__PURE__ */ jsx(
    Button,
    {
      className: "min-w-160",
      color: "primary",
      variant: "flat",
      size: "sm",
      startIcon: /* @__PURE__ */ jsx(FileUploadIcon, {}),
      disabled: !(activePage == null ? void 0 : activePage.canUpload),
      children: /* @__PURE__ */ jsx(Trans, { message: "Upload" })
    }
  );
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsxs(
    MenuTrigger,
    {
      onItemSelected: async (value) => {
        var _a2;
        if (value === "uploadFiles") {
          uploadFiles(await openUploadWindow({ multiple: true }));
        } else if (value === "uploadFolder") {
          uploadFiles(await openUploadWindow({ directory: true }));
        } else if (value === "newFolder") {
          const activeFolder = (_a2 = driveState().activePage) == null ? void 0 : _a2.folder;
          driveState().setActiveActionDialog(
            "newFolder",
            activeFolder ? [activeFolder] : []
          );
        }
      },
      children: [
        button,
        /* @__PURE__ */ jsxs(Menu, { children: [
          /* @__PURE__ */ jsx(Item, { value: "uploadFiles", startIcon: /* @__PURE__ */ jsx(UploadFileIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Upload files" }) }),
          /* @__PURE__ */ jsx(Item, { value: "uploadFolder", startIcon: /* @__PURE__ */ jsx(DriveFolderUploadIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Upload folder" }) }),
          /* @__PURE__ */ jsx(Item, { value: "newFolder", startIcon: /* @__PURE__ */ jsx(CreateNewFolderIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Create folder" }) })
        ] })
      ]
    }
  ) });
}
function Sidebar({ className }) {
  const { isSubscribed } = useAuth();
  const { billing } = useSettings();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        className,
        "flex flex-col gap-20 border-r bg-alt text-sm font-medium text-muted"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "compact-scrollbar flex-auto overflow-y-auto", children: [
          /* @__PURE__ */ jsx(CreateNewButton, { className: "px-12 pt-28 text-center" }),
          /* @__PURE__ */ jsx(SidebarMenu, {}),
          /* @__PURE__ */ jsx(StorageMeter, {}),
          billing.enable ? /* @__PURE__ */ jsx("div", { className: "mt-14 pl-60", children: /* @__PURE__ */ jsx(
            Button,
            {
              elementType: Link,
              to: isSubscribed ? "/billing/change-plan" : "/pricing",
              variant: "outline",
              color: "primary",
              size: "xs",
              children: /* @__PURE__ */ jsx(Trans, { message: "Upgrade" })
            }
          ) }) : null
        ] }),
        /* @__PURE__ */ jsx(WorkspaceSwitcher, {})
      ]
    }
  );
}
function WorkspaceSwitcher() {
  const navigate = useNavigate$1();
  return /* @__PURE__ */ jsx(
    WorkspaceSelector,
    {
      onChange: () => {
        navigate(RootFolderPage.path);
      },
      className: "mt-auto w-full flex-shrink-0 border-t px-24 py-18"
    }
  );
}
function fetchEntries(params) {
  return apiClient.get("drive/file-entries", {
    params
  }).then((response) => response.data);
}
const setActiveFolder = (response) => {
  var _a2;
  const firstPage = response.pages[0];
  const newFolder = firstPage.folder;
  const currentPage = driveState().activePage;
  if (newFolder && currentPage && currentPage.uniqueId === newFolder.hash && // only update page if once to set the folder or if permissions change, to keep page reference as stable as possible
  (!currentPage.folder || !shallowEqual(newFolder.permissions, (_a2 = currentPage.folder) == null ? void 0 : _a2.permissions))) {
    driveState().setActivePage(makeFolderPage(newFolder));
  }
  return response;
};
function usePaginatedEntries() {
  const page = useDriveStore((s) => s.activePage);
  const sortDescriptor = useDriveStore((s) => s.sortDescriptor);
  const [searchParams] = useSearchParams();
  const { workspaceId } = useActiveWorkspaceId();
  const params = {
    section: page == null ? void 0 : page.name,
    ...page == null ? void 0 : page.queryParams,
    ...Object.fromEntries(searchParams),
    folderId: (page == null ? void 0 : page.isFolderPage) ? page.uniqueId : null,
    workspaceId,
    ...sortDescriptor
  };
  const isDisabledInSearch = page === SearchPage && !params.query && !params.filters;
  const query = useInfiniteQuery({
    queryKey: DriveQueryKeys.fetchEntries(params),
    queryFn: ({ pageParam = 1 }) => {
      return fetchEntries({ ...params, page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      const currentPage = lastResponse.current_page;
      const lastPage = lastResponse.last_page;
      if (currentPage >= lastPage) {
        return void 0;
      }
      return currentPage + 1;
    },
    enabled: page != null && !isDisabledInSearch
  });
  useEffect(() => {
    var _a2;
    if ((_a2 = query.data) == null ? void 0 : _a2.pages[0].folder) {
      setActiveFolder(query.data);
    }
  }, [query.data]);
  return query;
}
function getAllEntries() {
  const caches = queryClient.getQueriesData({ queryKey: DriveQueryKeys.fetchEntries() });
  return caches.reduce((all, cache) => {
    const current = cache[1] ? cache[1].pages.flatMap((p) => p.data) : [];
    return [...all, ...current];
  }, []);
}
const driveSearchFilters = [
  FILE_ENTRY_TYPE_FILTER,
  {
    key: "owner_id",
    label: message("Owner"),
    description: message("User file was uploaded by"),
    defaultOperator: FilterOperator.eq,
    control: {
      type: FilterControlType.Select,
      defaultValue: "02",
      options: [
        {
          key: "01",
          label: message("anyone"),
          value: { value: null, operator: "!=" }
        },
        {
          key: "02",
          label: message("me"),
          value: "{authId}"
        },
        {
          key: "03",
          label: message("not me"),
          value: { value: "{authId}", operator: "!=" }
        }
      ]
    }
  },
  createdAtFilter({
    description: message("Date file was uploaded")
  }),
  updatedAtFilter({
    description: message("Date file was last changed")
  }),
  {
    key: "deleted_at",
    label: message("In trash"),
    description: message("Only show files that are in the trash"),
    defaultOperator: FilterOperator.ne,
    control: {
      type: FilterControlType.BooleanToggle,
      defaultValue: null
    }
  },
  {
    key: "shareableLink",
    label: message("Has shareable link"),
    description: message("Only show files that have a shareable link"),
    defaultOperator: FilterOperator.has,
    control: {
      type: FilterControlType.BooleanToggle,
      defaultValue: "*"
    }
  },
  {
    control: {
      type: FilterControlType.BooleanToggle,
      defaultValue: true
    },
    key: "sharedByMe",
    label: message("Shared by me"),
    description: message("Only show files that are shared with someone"),
    defaultOperator: FilterOperator.eq
  }
];
const alwaysShownFilters = driveSearchFilters.map((f) => f.key);
function SearchFilterList() {
  const activePage = useDriveStore((s) => s.activePage);
  const { isMobileMode } = useContext(DashboardLayoutContext);
  const { trans } = useTrans();
  const navigate = useNavigate$1();
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("query") || "");
  if (activePage !== SearchPage) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "mb-30 mt-10 px-10 md:px-26", children: [
    isMobileMode && /* @__PURE__ */ jsx(
      "form",
      {
        className: "contents",
        onSubmit: (e) => {
          var _a2;
          e.preventDefault();
          if (((_a2 = document.activeElement) == null ? void 0 : _a2.tagName) === "INPUT") {
            document.activeElement.blur();
          }
          navigate(
            {
              pathname: SearchPage.path,
              search: `?query=${inputValue}`
            },
            { replace: true }
          );
        },
        children: /* @__PURE__ */ jsx(
          TextField,
          {
            autoFocus: true,
            className: "mb-20",
            startAdornment: /* @__PURE__ */ jsx(IconButton, { type: "submit", children: /* @__PURE__ */ jsx(SearchIcon, {}) }),
            placeholder: trans(message("Type to search")),
            value: inputValue,
            onChange: (e) => setInputValue(e.target.value)
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      FilterList,
      {
        filters: driveSearchFilters,
        pinnedFilters: alwaysShownFilters
      }
    )
  ] });
}
function restrictResizableWithinBoundary(rect, boundaryRect) {
  const boundedRect = { ...rect };
  boundedRect.left = Math.max(0, boundedRect.left);
  const leftRestriction = boundedRect.left - rect.left;
  if (leftRestriction > 0) {
    boundedRect.width -= leftRestriction;
  }
  boundedRect.top = Math.max(0, boundedRect.top);
  const topRestriction = boundedRect.top - rect.top;
  if (topRestriction > 0) {
    boundedRect.height -= topRestriction;
  }
  boundedRect.width = Math.min(
    boundedRect.width,
    boundaryRect.width - boundedRect.left
  );
  boundedRect.height = Math.min(
    boundedRect.height,
    boundaryRect.height - boundedRect.top
  );
  return boundedRect;
}
const mouseSelectables = /* @__PURE__ */ new Map();
function useMouseSelectable(options) {
  const { id, ref } = options;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  useLayoutEffect(() => {
    if (!ref.current)
      return;
    mouseSelectables.set(id, {
      ...mouseSelectables.get(id),
      id,
      ref,
      // avoid stale closures
      onSelected: () => {
        var _a2, _b2;
        (_b2 = (_a2 = optionsRef.current).onSelected) == null ? void 0 : _b2.call(_a2);
      },
      onDeselected: () => {
        var _a2, _b2;
        return (_b2 = (_a2 = optionsRef.current).onDeselected) == null ? void 0 : _b2.call(_a2);
      }
    });
    return () => {
      droppables.delete(id);
    };
  }, [id, optionsRef, ref]);
}
function rectsIntersect(rectA, rectB) {
  if (!rectA || !rectB)
    return false;
  return rectA.left <= rectB.left + rectB.width && rectA.left + rectA.width >= rectB.left && rectA.top <= rectB.top + rectB.height && rectA.top + rectA.height >= rectB.top;
}
function useMouseSelectionBox({ onPointerDown, ...props } = {}) {
  const defaultRef = useRef(null);
  const containerRef = props.containerRef || defaultRef;
  const boxRef = useRef(null);
  let state = useRef({}).current;
  const drawSelectionBox = () => {
    var _a2, _b2, _c, _d, _e, _f, _g;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
    }
    if (!state.startPoint || !state.endPoint || !state.boundaryRect)
      return;
    const startPoint = state.startPoint;
    const endPoint = state.endPoint;
    const initialScrollTop = startPoint.scrollTop || 0;
    const currentScrollTop = ((_a2 = containerRef.current) == null ? void 0 : _a2.scrollTop) || 0;
    const newRect = {
      left: Math.min(startPoint.x, endPoint.x),
      top: Math.min(startPoint.y, endPoint.y),
      width: Math.abs(startPoint.x - endPoint.x),
      height: Math.abs(startPoint.y - endPoint.y)
    };
    newRect.left -= state.boundaryRect.left;
    newRect.top -= state.boundaryRect.top;
    newRect.top += initialScrollTop;
    const scrollDiff = currentScrollTop - initialScrollTop;
    const scrollValue = Math.abs(scrollDiff);
    if (scrollDiff < 0) {
      newRect.top -= scrollValue;
    }
    newRect.height += scrollValue;
    const boundedRect = state.boundaryRect ? restrictResizableWithinBoundary(newRect, state.boundaryRect) : { ...newRect };
    if (boxRef.current) {
      state.rafId = requestAnimationFrame(() => {
        if (boxRef.current) {
          boxRef.current.style.display = `block`;
          boxRef.current.style.transform = `translate(${boundedRect.left}px, ${boundedRect.top}px)`;
          boxRef.current.style.width = `${boundedRect.width}px`;
          boxRef.current.style.height = `${boundedRect.height}px`;
        }
        state.rafId = void 0;
      });
    }
    const absoluteRect = {
      ...boundedRect,
      left: boundedRect.left + state.boundaryRect.left,
      top: boundedRect.top + state.boundaryRect.top - currentScrollTop
    };
    for (const [, selectable] of mouseSelectables) {
      const intersect = rectsIntersect(selectable.rect, absoluteRect);
      if (intersect && !((_b2 = state.selectedIds) == null ? void 0 : _b2.has(selectable.id))) {
        (_c = state.selectedIds) == null ? void 0 : _c.add(selectable.id);
        (_d = selectable.onSelected) == null ? void 0 : _d.call(selectable);
      } else if (!intersect && ((_e = state.selectedIds) == null ? void 0 : _e.has(selectable.id))) {
        (_f = state.selectedIds) == null ? void 0 : _f.delete(selectable.id);
        (_g = selectable.onDeselected) == null ? void 0 : _g.call(selectable);
      }
    }
  };
  const pointerEvents = usePointerEvents({
    minimumMovement: 4,
    onPointerDown,
    onMoveStart: (e) => {
      if (activeInteraction) {
        return false;
      }
      updateRects(mouseSelectables);
      state = {
        selectedIds: /* @__PURE__ */ new Set()
      };
      const el = containerRef.current;
      state.startPoint = {
        x: e.clientX,
        y: e.clientY,
        scrollTop: (el == null ? void 0 : el.scrollTop) || 0
      };
      state.scrollListener = (e2) => {
        var _a2;
        if (!state.startPoint)
          return;
        updateRects(mouseSelectables);
        if ((_a2 = state.boundaryRect) == null ? void 0 : _a2.height) {
          state.boundaryRect.height = e2.target.scrollHeight;
        }
        drawSelectionBox();
      };
      if (el) {
        const rect = el.getBoundingClientRect();
        el.addEventListener("scroll", state.scrollListener);
        state.boundaryRect = {
          top: rect.top,
          left: rect.left,
          height: el.scrollHeight,
          heightWithoutScroll: rect.height,
          width: el.scrollWidth
        };
      }
    },
    onMove: (e) => {
      state.endPoint = { x: e.clientX, y: e.clientY };
      if (state.boundaryRect && containerRef.current) {
        const reachedBottomEdge = e.clientY + 20 > state.boundaryRect.heightWithoutScroll + state.boundaryRect.top;
        const reachedTopEdge = e.clientY - 20 < state.boundaryRect.top;
        if (reachedBottomEdge) {
          containerRef.current.scrollBy({ top: 10 });
        } else if (reachedTopEdge) {
          containerRef.current.scrollBy({ top: -10 });
        }
      }
      drawSelectionBox();
    },
    onMoveEnd: () => {
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
      }
      if (containerRef.current && state.scrollListener) {
        containerRef.current.removeEventListener(
          "scroll",
          state.scrollListener
        );
      }
      if (boxRef.current) {
        boxRef.current.style.display = `none`;
        boxRef.current.style.transform = "";
        boxRef.current.style.width = "";
        boxRef.current.style.height = "";
      }
      state = {};
    }
  });
  return {
    containerProps: {
      ...pointerEvents.domProps,
      ref: containerRef
    },
    boxProps: { ref: boxRef }
  };
}
function useEntries() {
  const query = usePaginatedEntries();
  if (!query.data)
    return [];
  return query.data.pages.flatMap((p) => p.data);
}
function useSelectedEntries() {
  const ids = useDriveStore((s) => s.selectedEntries);
  const entries = useEntries();
  return Array.from(ids).map((id) => entries.find((entry) => entry.id === id)).filter((e) => !!e);
}
function useSelectedEntry() {
  const entries = useSelectedEntries();
  return entries[0];
}
function useSelectedEntryParent() {
  const entry = useSelectedEntry();
  const { data } = useFolders();
  if (!entry || !(data == null ? void 0 : data.folders))
    return;
  return data.folders.find((e) => e.id === entry.parent_id);
}
function getSelectedEntries() {
  const ids = Array.from(driveState().selectedEntries);
  const allEntries = getAllEntries();
  return ids.map((id) => allEntries.find((entry) => entry.id === id)).filter((e) => !!e);
}
function EntryActionList({ className }) {
  const selectedEntries = useSelectedEntries();
  if (!selectedEntries.length) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx(ActionList, { entries: selectedEntries }) });
}
function ActionList({ entries }) {
  const preview = usePreviewAction(entries);
  const share = useShareAction(entries);
  const deleteAction = useDeleteEntriesAction(entries);
  const removeShared = useRemoveSharedEntriesAction(entries);
  const actions = [preview, share, deleteAction, removeShared].filter(
    (action) => !!action
  );
  return /* @__PURE__ */ jsxs("div", { className: "entry-action-list", children: [
    actions.map((action) => /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { ...action.label }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "sm",
        onClick: () => {
          action.execute();
        },
        children: createElement(action.icon)
      }
    ) }, action.key)),
    /* @__PURE__ */ jsx(EntryActionMenuTrigger, { entries, children: /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "More actions" }), children: /* @__PURE__ */ jsx(IconButton, { children: /* @__PURE__ */ jsx(MoreVertIcon, {}) }) }) })
  ] });
}
function DriveContextMenu() {
  var _a2;
  const selectedEntries = useSelectedEntries();
  const activePage = useDriveStore((s) => s.activePage);
  const data = useDriveStore((s) => s.contextMenuData);
  const entries = (data == null ? void 0 : data.entry) ? [data.entry] : selectedEntries;
  if (((_a2 = data == null ? void 0 : data.entry) == null ? void 0 : _a2.id) === 0) {
    return /* @__PURE__ */ jsx(PageContextMenu, { position: data, page: RootFolderPage });
  }
  if (data && entries.length) {
    return /* @__PURE__ */ jsx(EntriesContextMenu, { entries, position: data });
  }
  if (data && activePage) {
    return /* @__PURE__ */ jsx(PageContextMenu, { position: data, page: activePage });
  }
  return null;
}
function EntriesContextMenu({ entries, position }) {
  const actions = useEntryActions(entries);
  return /* @__PURE__ */ jsx(BaseContextMenu, { position, actions });
}
function PageContextMenu({ page, position }) {
  const actions = useDrivePageActions(page);
  return /* @__PURE__ */ jsx(BaseContextMenu, { position, actions });
}
function BaseContextMenu({ position, actions }) {
  return /* @__PURE__ */ jsx(
    ContextMenu,
    {
      position,
      onOpenChange: (isOpen) => {
        if (!isOpen) {
          driveState().setContextMenuData(null);
        }
      },
      children: actions.map((action) => /* @__PURE__ */ jsx(
        Item,
        {
          value: action.key,
          onSelected: action.execute,
          startIcon: createElement(action.icon),
          children: /* @__PURE__ */ jsx(Trans, { ...action.label })
        },
        action.key
      ))
    }
  );
}
function useIsTouchDevice() {
  return useMediaQuery("((pointer: coarse))");
}
function useFileViewDnd(entry) {
  const isTouchDevice = useIsTouchDevice();
  const ref = useRef(null);
  const { onDrop } = useFolderDropAction(entry);
  const [isDragOver, setIsDragOver] = useState(false);
  const isDragging = useDriveStore(
    (s) => s.entriesBeingDragged.includes(entry.id)
  );
  const activePage = useDriveStore((s) => s.activePage);
  const { draggableProps } = useDraggable({
    disabled: !!isTouchDevice || activePage === TrashPage,
    id: entry.id,
    type: "fileEntry",
    ref,
    hidePreview: true,
    onDragStart: (e, target) => {
      if (!driveState().selectedEntries.has(entry.id)) {
        driveState().selectEntries([entry.id]);
      }
      driveState().setEntriesBeingDragged(target.getData().map((e2) => e2.id));
    },
    onDragEnd: () => {
      driveState().setEntriesBeingDragged([]);
    },
    getData: () => getSelectedEntries()
  });
  const { droppableProps } = useDroppable({
    id: entry.id,
    disabled: isTouchDevice || entry.type !== "folder",
    ref,
    types: ["fileEntry", "nativeFile"],
    acceptsDrop: (target) => folderAcceptsDrop(target, entry),
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    onDrop
  });
  useMouseSelectable({
    id: entry.id,
    ref,
    onSelected: () => {
      driveState().selectEntries([entry.id], true);
    },
    onDeselected: () => {
      driveState().deselectEntries([entry.id]);
    }
  });
  const itemClassName = clsx(
    isDragging && "opacity-20",
    isDragOver && "ring ring-offset-4 ring-primary bg-primary-light/10 rounded"
  );
  return {
    draggableProps,
    droppableProps,
    isDragOver,
    isDragging,
    itemClassName,
    ref
  };
}
function FileTableRow({
  item,
  children,
  className,
  ...domProps
}) {
  const { isCollapsedMode } = useContext(TableContext);
  const { draggableProps, droppableProps, itemClassName, ref } = useFileViewDnd(item);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(className, itemClassName),
      ref,
      ...mergeProps(draggableProps, droppableProps, domProps, {
        onContextMenu: (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isCollapsedMode) {
            if (!driveState().selectedEntries.has(item.id)) {
              driveState().selectEntries([item.id]);
            }
            driveState().setContextMenuData({ x: e.clientX, y: e.clientY });
          }
        }
      }),
      children
    }
  );
}
function useViewItemActionHandler() {
  const navigate = useNavigate$1();
  const performViewItemAction = useCallback(
    (entry) => {
      if (entry && entry.type === "folder") {
        if (driveState().activePage === TrashPage) {
          driveState().setActiveActionDialog("trashFolderBlock", [entry]);
        } else {
          navigate(getPathForFolder(entry.hash));
        }
      } else {
        const selectedEntries = getSelectedEntries();
        driveState().setActiveActionDialog(
          "preview",
          selectedEntries.length ? selectedEntries : [entry]
        );
      }
    },
    [navigate]
  );
  return { performViewItemAction };
}
function FileTable({ entries }) {
  const { performViewItemAction } = useViewItemActionHandler();
  const selectedEntries = useDriveStore((s) => s.selectedEntries);
  const sortDescriptor = useDriveStore((s) => s.sortDescriptor);
  const selectedRows = useMemo(() => {
    return [...selectedEntries];
  }, [selectedEntries]);
  return /* @__PURE__ */ jsx(
    Table,
    {
      columns: fileTableColumns,
      data: entries,
      sortDescriptor,
      onSortChange: (value) => {
        driveState().setSortDescriptor(value);
      },
      onAction: performViewItemAction,
      selectedRows,
      selectionStyle: "highlight",
      renderRowAs: FileTableRow,
      onSelectionChange: (value) => {
        driveState().selectEntries(value);
      }
    }
  );
}
function FileGridItem({ entry }) {
  const isSelected = useDriveStore((s) => s.selectedEntries.has(entry.id));
  const { performViewItemAction } = useViewItemActionHandler();
  const { isMobileMode } = useContext(DashboardLayoutContext);
  const { draggableProps, droppableProps, itemClassName, ref } = useFileViewDnd(entry);
  const toggleEntry = () => {
    if (isSelected) {
      driveState().deselectEntries([entry.id]);
    } else {
      driveState().selectEntries([entry.id], true);
    }
  };
  const pressHandler = (e, el) => {
    if (isMobileMode) {
      if (driveState().selectedEntries.size) {
        toggleEntry();
      } else {
        performViewItemAction(entry);
      }
    } else {
      if (isCtrlOrShiftPressed(e)) {
        toggleEntry();
      } else {
        driveState().selectEntries([entry.id]);
      }
    }
  };
  const { domProps: pressProps } = usePointerEvents({
    onLongPress: isMobileMode ? () => toggleEntry() : void 0,
    onPress: pressHandler
  });
  const keyboardHandler = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      performViewItemAction(entry);
    }
  };
  const contextMenuHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMobileMode) {
      if (!driveState().selectedEntries.has(entry.id)) {
        driveState().selectEntries([entry.id]);
      }
      driveState().setContextMenuData({ x: e.clientX, y: e.clientY });
    }
  };
  return /* @__PURE__ */ jsx(
    BaseFileGridItem,
    {
      ...mergeProps(draggableProps, droppableProps, pressProps, {
        onKeyDown: createEventHandler(keyboardHandler)
      }),
      ref,
      entry,
      isSelected,
      isMobileMode: !!isMobileMode,
      tabIndex: -1,
      onDoubleClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isMobileMode) {
          performViewItemAction(entry);
        }
      },
      footerAdornment: isMobileMode && /* @__PURE__ */ jsx(FooterAdornment, { entry, isSelected }),
      onContextMenu: createEventHandler(contextMenuHandler),
      className: itemClassName
    }
  );
}
function FooterAdornment({ entry, isSelected }) {
  const anySelected = useDriveStore((s) => s.selectedEntries.size);
  if (anySelected) {
    return /* @__PURE__ */ jsx(Checkbox, { className: "block mr-8", checked: isSelected });
  }
  return /* @__PURE__ */ jsx(EntryActionMenuTrigger, { entries: [entry], children: /* @__PURE__ */ jsx(
    IconButton,
    {
      className: "text-muted",
      onPointerDown: (e) => {
        e.stopPropagation();
      },
      children: /* @__PURE__ */ jsx(MoreVertIcon, {})
    }
  ) });
}
function FileGrid({ entries }) {
  return /* @__PURE__ */ jsx("div", { className: "file-grid-container", children: /* @__PURE__ */ jsx("div", { className: "file-grid", children: entries.map((entry) => {
    return /* @__PURE__ */ jsx(FileGridItem, { entry }, entry.id);
  }) }) });
}
function DriveSortButton({ isDisabled }) {
  const descriptor = useDriveStore((s) => s.sortDescriptor);
  return /* @__PURE__ */ jsx(
    EntriesSortButton,
    {
      isDisabled,
      descriptor,
      onChange: (value) => {
        driveState().setSortDescriptor(value);
      }
    }
  );
}
function PageBreadcrumbs({ className }) {
  const { isMobileMode } = useContext(DashboardLayoutContext);
  const navigate = useNavigate$1();
  const page = useDriveStore((s) => s.activePage);
  const folder = page == null ? void 0 : page.folder;
  const query = useFolderPath({
    hash: folder == null ? void 0 : folder.hash,
    isEnabled: (folder == null ? void 0 : folder.hash) !== RootFolderPage.folder.hash
  });
  const workspace = useActiveWorkspace();
  const rootItem = useRootItem();
  const isLoading = !page || !workspace || page.isFolderPage && !folder || query.fetchStatus !== "idle";
  let content;
  if (isLoading) {
    content = null;
  } else {
    const items = rootItem ? [rootItem] : [];
    if (query.data) {
      query.data.path.forEach((parent) => {
        items.push({
          page: makeFolderPage(parent),
          label: parent.name
        });
      });
    }
    content = /* @__PURE__ */ jsx(
      Breadcrumb,
      {
        className,
        size: isMobileMode ? "md" : "lg",
        currentIsClickable: true,
        children: items.map((item, index) => {
          const isLast = index === items.length - 1;
          if (!isLast) {
            return /* @__PURE__ */ jsx(
              BreadcrumbItem,
              {
                onSelected: () => {
                  navigate(item.page.path);
                },
                children: /* @__PURE__ */ jsx(MixedText, { value: item.label })
              },
              item.page.uniqueId
            );
          }
          return /* @__PURE__ */ jsx(BreadcrumbItem, { children: ({ isMenuItem }) => {
            if (isMenuItem || !item.page.folder && item.page !== TrashPage)
              return /* @__PURE__ */ jsx(MixedText, { value: item.label });
            return /* @__PURE__ */ jsx(EntryActionMenuTrigger, { page: item.page, children: /* @__PURE__ */ jsxs(ButtonBase, { className: "flex items-center gap-2 rounded focus-visible:ring-offset-4", children: [
              /* @__PURE__ */ jsx(MixedText, { value: item.label }),
              /* @__PURE__ */ jsx(ArrowDropDownIcon, { className: "text-muted icon-md" })
            ] }) });
          } }, item.page.uniqueId);
        })
      }
    );
  }
  return content;
}
function useRootItem() {
  var _a2, _b2;
  const page = useDriveStore((s) => s.activePage);
  const workspace = useActiveWorkspace();
  const { user } = useAuth();
  if (!page)
    return null;
  if (workspace && !workspace.default) {
    if ((page == null ? void 0 : page.isFolderPage) && ((page == null ? void 0 : page.name) === RootFolderPage.name || ((_a2 = page.folder) == null ? void 0 : _a2.workspace_id) === workspace.id)) {
      return { label: workspace.name, page: RootFolderPage };
    }
  }
  if (page == null ? void 0 : page.isFolderPage) {
    const owner = (_b2 = page.folder) == null ? void 0 : _b2.users.find((u) => u.owns_entry);
    if ((owner == null ? void 0 : owner.id) !== (user == null ? void 0 : user.id)) {
      return { label: SharesPage.label, page: SharesPage };
    }
    return { label: RootFolderPage.label, page: RootFolderPage };
  }
  return { label: page.label, page };
}
function InfiniteScrollSentinel({
  query: { isInitialLoading, fetchNextPage, isFetchingNextPage, hasNextPage },
  children,
  loaderMarginTop = "mt-24",
  style,
  className,
  variant: _variant = "infiniteScroll",
  loadMoreExtraContent,
  size = "md"
}) {
  const sentinelRef = useRef(null);
  const isLoading = isFetchingNextPage || isInitialLoading;
  const [loadMoreClickCount, setLoadMoreClickCount] = useState(0);
  const innerVariant = _variant === "loadMore" && loadMoreClickCount < 3 ? "loadMore" : "infiniteScroll";
  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl || innerVariant === "loadMore")
      return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isLoading) {
        fetchNextPage();
      }
    });
    observer.observe(sentinelEl);
    return () => {
      observer.unobserve(sentinelEl);
    };
  }, [fetchNextPage, hasNextPage, isLoading, innerVariant]);
  let content;
  if (children) {
    content = isFetchingNextPage ? children : null;
  } else if (innerVariant === "loadMore") {
    content = !isInitialLoading && hasNextPage && /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center gap-8", loaderMarginTop), children: [
      loadMoreExtraContent,
      /* @__PURE__ */ jsx(
        Button,
        {
          size: size === "md" ? "sm" : "xs",
          className: clsx(
            size === "sm" ? "min-h-24 min-w-96" : "min-h-36 min-w-112"
          ),
          variant: "outline",
          color: "primary",
          onClick: () => {
            fetchNextPage();
            setLoadMoreClickCount(loadMoreClickCount + 1);
          },
          disabled: isLoading,
          children: loadMoreClickCount >= 2 && !isFetchingNextPage ? /* @__PURE__ */ jsx(Trans, { message: "Load all" }) : /* @__PURE__ */ jsx(Trans, { message: "Show more" })
        }
      )
    ] });
  } else {
    content = /* @__PURE__ */ jsx(AnimatePresence, { children: isFetchingNextPage && /* @__PURE__ */ jsx(
      m.div,
      {
        className: clsx("flex justify-center w-full", loaderMarginTop),
        ...opacityAnimation,
        children: /* @__PURE__ */ jsx(ProgressCircle, { size, isIndeterminate: true, "aria-label": "loading" })
      }
    ) });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style,
      className: clsx("w-full", className, hasNextPage && "min-h-36"),
      role: "presentation",
      children: [
        /* @__PURE__ */ jsx("div", { ref: sentinelRef, "aria-hidden": true }),
        content
      ]
    }
  );
}
function DropTargetMask({ isVisible }) {
  const mask = /* @__PURE__ */ jsx(
    m.div,
    {
      ...opacityAnimation,
      transition: { duration: 0.3 },
      className: "absolute inset-0 w-full min-h-full bg-primary-light/30 border-2 border-dashed border-primary pointer-events-none",
      children: /* @__PURE__ */ jsx(
        m.div,
        {
          initial: { y: "100%", opacity: 0 },
          animate: { y: "-10px", opacity: 1 },
          exit: { y: "100%", opacity: 0 },
          className: "p-10 bg-primary text-on-primary fixed bottom-0 left-0 right-0 max-w-max mx-auto rounded",
          children: /* @__PURE__ */ jsx(Trans, { message: "Drop files to upload them to this folder." })
        }
      )
    },
    "dragTargetMask"
  );
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isVisible ? mask : null });
}
function FileView({ className }) {
  const [params] = useSearchParams();
  const isSearchingOrFiltering = !!params.get("query") || !!params.get("filters");
  const containerRef = useRef(null);
  const query = usePaginatedEntries();
  const entries = useEntries();
  const { uploadFiles } = useDriveUploadQueue();
  const deleteEntries2 = useDeleteEntries();
  const activePage = useDriveStore((s) => s.activePage);
  const [isDragOver, setIsDragOver] = useState(false);
  const viewMode = useDriveStore((s) => s.viewMode);
  const { isMobileMode } = useContext(DashboardLayoutContext);
  const { containerProps, boxProps } = useMouseSelectionBox({
    containerRef,
    onPointerDown: (e) => {
      if (!e.target.closest(".entry-action-list")) {
        driveState().deselectEntries("all");
      }
    }
  });
  const { droppableProps } = useDroppable({
    id: "driveRoot",
    ref: containerRef,
    types: ["nativeFile"],
    disabled: !(activePage == null ? void 0 : activePage.canUpload),
    onDragEnter: () => {
      setIsDragOver(true);
    },
    onDragLeave: () => {
      setIsDragOver(false);
    },
    onDrop: async (draggable) => {
      if (draggable.type === "nativeFile") {
        uploadFiles(await draggable.getData());
      }
    }
  });
  if (!activePage)
    return null;
  let content;
  if (!entries.length && (!query.isLoading || query.fetchStatus === "idle")) {
    const noContentMessage = activePage.noContentMessage(
      isSearchingOrFiltering
    );
    content = /* @__PURE__ */ jsx(
      IllustratedMessage,
      {
        className: "mt-40",
        image: /* @__PURE__ */ jsx(SvgImage, { src: noContentMessage.image }),
        title: /* @__PURE__ */ jsx(Trans, { ...noContentMessage.title }),
        description: /* @__PURE__ */ jsx(Trans, { ...noContentMessage.description })
      }
    );
  } else if (!query.isLoading) {
    content = viewMode === "list" ? /* @__PURE__ */ jsx(FileTable, { entries }) : /* @__PURE__ */ jsx(FileGrid, { entries });
  }
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    driveState().deselectEntries("all");
    driveState().setContextMenuData({ x: e.clientX, y: e.clientY });
  };
  const handleKeybinds = (e) => {
    if (e.key === "a" && isCtrlKeyPressed(e)) {
      e.preventDefault();
      e.stopPropagation();
      driveState().selectEntries(entries.map((entry) => entry.id));
    }
    if (e.key === "Delete") {
      e.preventDefault();
      e.stopPropagation();
      if (driveState().selectedEntries.size && !deleteEntries2.isPending) {
        if (activePage === TrashPage) {
          driveState().setActiveActionDialog(
            "confirmAndDeleteForever",
            getSelectedEntries()
          );
        } else {
          deleteEntries2.mutate({
            entryIds: [...driveState().selectedEntries],
            deleteForever: activePage === TrashPage
          });
          driveState().selectEntries([]);
        }
      }
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx("relative outline-none", className),
      tabIndex: -1,
      ...mergeProps(containerProps, droppableProps, {
        onKeyDown: createEventHandler(handleKeybinds)
      }),
      onContextMenu: handleContextMenu,
      children: /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-full flex-col pt-10", children: [
        isMobileMode ? /* @__PURE__ */ jsx(PageBreadcrumbs, { className: "mb-10 px-14" }) : /* @__PURE__ */ jsx(Toolbar, {}),
        /* @__PURE__ */ jsx(SearchFilterList, {}),
        /* @__PURE__ */ jsxs("div", { className: "relative flex-auto px-18 pb-18 md:px-24", children: [
          /* @__PURE__ */ jsx(AdHost, { slot: "drive", className: "mb-24" }),
          content,
          /* @__PURE__ */ jsx(InfiniteScrollSentinel, { query })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            ...boxProps,
            className: "pointer-events-none absolute left-0 top-0 z-10 hidden border border-primary-light bg-primary-light/20 shadow-md"
          }
        ),
        /* @__PURE__ */ jsx(DriveContextMenu, {}),
        /* @__PURE__ */ jsx(DropTargetMask, { isVisible: isDragOver })
      ] })
    }
  );
}
function Toolbar() {
  const activePage = useDriveStore((s) => s.activePage);
  return /* @__PURE__ */ jsxs("div", { className: "my-10 flex min-h-42 items-center justify-between gap-40 px-10 text-muted md:px-18", children: [
    /* @__PURE__ */ jsx(DriveSortButton, { isDisabled: activePage == null ? void 0 : activePage.disableSort }),
    /* @__PURE__ */ jsx(EntryActionList, { className: "text-muted" })
  ] });
}
const UploadQueueItem = memo(({ file, style }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "p-10 flex items-center gap-14 w-full absolute top-0 left-0",
      style,
      children: [
        /* @__PURE__ */ jsx("div", { className: "shrink-0 border rounded p-8", children: /* @__PURE__ */ jsx(FileTypeIcon, { className: "w-22 h-22", mime: file.mime }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-auto min-w-0 pr-10", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-2 flex items-center min-w-0 gap-10", children: /* @__PURE__ */ jsx("div", { className: "flex-auto font-medium whitespace-nowrap min-w-0 overflow-hidden overflow-ellipsis", children: file.name }) }),
          /* @__PURE__ */ jsx(SizeInfo, { file })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mr-10", children: /* @__PURE__ */ jsx(FileStatus, { file }) })
      ]
    }
  );
});
function SizeInfo({ file }) {
  const fileUpload = useFileUploadStore((s) => s.fileUploads.get(file.id));
  const bytesUploaded = (fileUpload == null ? void 0 : fileUpload.bytesUploaded) || 0;
  const totalBytes = useMemo(() => prettyBytes(file.size), [file]);
  const uploadedBytes = useMemo(
    () => prettyBytes(bytesUploaded),
    [bytesUploaded]
  );
  let statusMessage;
  if ((fileUpload == null ? void 0 : fileUpload.status) === "completed") {
    statusMessage = /* @__PURE__ */ jsx(Trans, { message: "Upload complete" });
  } else if ((fileUpload == null ? void 0 : fileUpload.status) === "aborted") {
    statusMessage = /* @__PURE__ */ jsx(Trans, { message: "Upload cancelled" });
  } else if ((fileUpload == null ? void 0 : fileUpload.status) === "failed") {
    statusMessage = /* @__PURE__ */ jsx(Trans, { message: "Upload failed" });
  } else {
    statusMessage = /* @__PURE__ */ jsx(
      Trans,
      {
        message: ":bytesUploaded of :totalBytes",
        values: {
          bytesUploaded: uploadedBytes,
          totalBytes
        }
      }
    );
  }
  return /* @__PURE__ */ jsx("div", { className: "text-muted text-xs", children: statusMessage });
}
function FileStatus({ file }) {
  const fileUpload = useFileUploadStore((s) => s.fileUploads.get(file.id));
  const abortUpload = useFileUploadStore((s) => s.abortUpload);
  const percentage = (fileUpload == null ? void 0 : fileUpload.percentage) || 0;
  const status = fileUpload == null ? void 0 : fileUpload.status;
  const errorMessage = fileUpload == null ? void 0 : fileUpload.errorMessage;
  const [isHovered, setIsHovered] = useState(false);
  const abortButton = /* @__PURE__ */ jsx(
    IconButton,
    {
      size: "sm",
      onClick: () => {
        abortUpload(file.id);
      },
      children: /* @__PURE__ */ jsx(CloseIcon, {})
    }
  );
  const progressButton = /* @__PURE__ */ jsx(ProgressCircle, { "aria-label": "Upload progress", size: "sm", value: percentage });
  let statusButton;
  if (status === "failed") {
    const errMessage = errorMessage || message("This file could not be uploaded");
    statusButton = /* @__PURE__ */ jsx(AnimatedStatus, { children: /* @__PURE__ */ jsx(Tooltip, { variant: "danger", label: /* @__PURE__ */ jsx(MixedText, { value: errMessage }), children: /* @__PURE__ */ jsx(ErrorIcon, { className: "text-danger", size: "md" }) }) });
  } else if (status === "aborted") {
    statusButton = /* @__PURE__ */ jsx(AnimatedStatus, { children: /* @__PURE__ */ jsx(WarningIcon, { className: "text-warning", size: "md" }) });
  } else if (status === "completed") {
    statusButton = /* @__PURE__ */ jsx(AnimatedStatus, { children: /* @__PURE__ */ jsx(CheckCircleIcon, { size: "md", className: "text-positive" }) });
  } else {
    statusButton = /* @__PURE__ */ jsx(
      AnimatedStatus,
      {
        onPointerEnter: (e) => {
          if (e.pointerType === "mouse") {
            setIsHovered(true);
          }
        },
        onPointerLeave: (e) => {
          if (e.pointerType === "mouse") {
            setIsHovered(false);
          }
        },
        children: isHovered ? abortButton : progressButton
      }
    );
  }
  return /* @__PURE__ */ jsx(AnimatePresence, { children: statusButton });
}
function AnimatedStatus({ children, ...domProps }) {
  return /* @__PURE__ */ jsx(
    m.div,
    {
      ...domProps,
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
      children
    }
  );
}
function UploadQueue() {
  const isOpen = useDriveStore((s) => s.uploadQueueIsOpen);
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(
    m.div,
    {
      className: "shadow-xl rounded fixed bottom-16 right-16 bg z-modal border w-375 text-sm",
      initial: { y: "100%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "100%", opacity: 0 },
      children: [
        /* @__PURE__ */ jsx(Header, {}),
        /* @__PURE__ */ jsx(UploadList, {})
      ]
    },
    "upload-queue"
  ) });
}
function Header() {
  const inProgressUploadsCount = useFileUploadStore((s) => s.activeUploadsCount);
  const completedUploadsCount = useFileUploadStore(
    (s) => s.completedUploadsCount
  );
  const clearInactive = useFileUploadStore((s) => s.clearInactive);
  let message2;
  if (inProgressUploadsCount) {
    message2 = /* @__PURE__ */ jsx(
      Trans,
      {
        message: "Uploading :count files",
        values: { count: inProgressUploadsCount }
      }
    );
  } else if (completedUploadsCount) {
    message2 = /* @__PURE__ */ jsx(
      Trans,
      {
        message: "Uploaded :count files",
        values: { count: completedUploadsCount }
      }
    );
  } else {
    message2 = /* @__PURE__ */ jsx(Trans, { message: "No active uploads" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "px-10 py-4 bg-alt flex items-center gap-10 justify-between border-b min-h-[45px]", children: [
    message2,
    inProgressUploadsCount === 0 ? /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "sm",
        onClick: () => {
          driveState().setUploadQueueIsOpen(false);
          setTimeout(() => {
            clearInactive();
          }, 200);
        },
        children: /* @__PURE__ */ jsx(CloseIcon, {})
      }
    ) : void 0
  ] });
}
function UploadList() {
  const uploads = useFileUploadStore((s) => s.fileUploads);
  const uploadsArray = [...uploads.values()];
  const ref = useRef(null);
  const virtualizer = useVirtualizer({
    count: uploads.size,
    getScrollElement: () => ref.current,
    estimateSize: () => 60,
    overscan: 4
  });
  return /* @__PURE__ */ jsx("div", { className: "max-h-320 overflow-y-auto", ref, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "relative w-full",
      style: {
        height: `${virtualizer.getTotalSize()}px`
      },
      children: virtualizer.getVirtualItems().map((virtualItem) => {
        const upload = uploadsArray[virtualItem.index];
        return /* @__PURE__ */ jsx(
          UploadQueueItem,
          {
            style: {
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            },
            file: upload.file
          },
          upload.file.id
        );
      })
    }
  ) });
}
const detailedExamination = "/assets/detailed-examination-33c85772.svg";
function DetailsSidebarHeader({ entryType, entryName }) {
  const { setRightSidenavStatus } = useContext(DashboardLayoutContext);
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-16 text-text-main mb-38", children: [
    /* @__PURE__ */ jsx(FileTypeIcon, { className: "w-24 h-24", type: entryType }),
    /* @__PURE__ */ jsx("div", { className: "text-xl font-normal text-ellipsis flex-auto mr-auto min-w-0 break-words", children: entryName }),
    /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "md",
        className: "flex-shrink-0",
        onClick: () => {
          setRightSidenavStatus("closed");
        },
        children: /* @__PURE__ */ jsx(CloseIcon, {})
      }
    )
  ] });
}
function DetailsSidebarSectionHeader({
  children,
  margin = "mb-20"
}) {
  return /* @__PURE__ */ jsx("div", { className: clsx("text-base text-main", margin), children });
}
function useSyncEntryTags() {
  return useMutation({
    mutationFn: (props) => createComment(props),
    onSuccess: () => {
      invalidateEntryQueries();
    },
    onError: (err) => showHttpErrorToast(err, message("Failed to save tags."))
  });
}
function createComment({ entry, tags }) {
  return apiClient.post(`file-entries/${entry.id}/sync-tags`, {
    tags: tags.map((tag) => tag.name)
  }).then((r) => r.data);
}
function useFileEntryTags(query) {
  return useQuery({
    queryKey: ["file-entry-tags", query],
    queryFn: () => fetchTags(query),
    placeholderData: keepPreviousData
  });
}
async function fetchTags(query) {
  return apiClient.get("file-entry-tags", { params: { query } }).then((r) => r.data);
}
function DetailsSidebarTags({ entry }) {
  return /* @__PURE__ */ jsxs("div", { className: "mt-20 border-t pt-20", children: [
    /* @__PURE__ */ jsx(DetailsSidebarSectionHeader, { margin: "mb-10", children: /* @__PURE__ */ jsx(Trans, { message: "Tags" }) }),
    /* @__PURE__ */ jsx(TagChipField, { entry }, entry.id)
  ] });
}
function TagChipField({ entry }) {
  var _a2;
  const { trans } = useTrans();
  const navigate = useNavigate$1();
  const syncTags = useSyncEntryTags();
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(entry.tags || []);
  const { data, isLoading } = useFileEntryTags(inputValue);
  const handleChange = (newTags) => {
    setValue(newTags);
    if (!syncTags.isPending) {
      syncTags.mutate({ tags: newTags, entry });
    }
  };
  return /* @__PURE__ */ jsx(
    ChipField,
    {
      isAsync: true,
      inputValue,
      onInputValueChange: setInputValue,
      suggestions: data == null ? void 0 : data.results,
      placeholder: trans(message("+Add tag")),
      isLoading,
      chipSize: "sm",
      value,
      onChange: handleChange,
      onChipClick: (chip) => {
        navigate(`/drive/search?query=${chip.name}`);
      },
      children: (_a2 = data == null ? void 0 : data.results) == null ? void 0 : _a2.map((result) => /* @__PURE__ */ jsx(Item, { value: result, children: result.name }, result.id))
    }
  );
}
function DetailsSidebarProperties({ entry }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(DetailsSidebarHeader, { entryType: entry.type, entryName: entry.name }),
    entry.type === "image" && /* @__PURE__ */ jsx(FileThumbnail, { className: "mb-20", file: entry }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(DetailsSidebarSectionHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Who has access" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-14", children: [
        entry.workspace_id ? /* @__PURE__ */ jsx("div", { className: "rounded-full border w-32 h-32 flex items-center justify-center", children: /* @__PURE__ */ jsx(GroupsIcon, { className: "icon-md" }) }) : null,
        entry.users.map((user) => /* @__PURE__ */ jsx(Tooltip, { label: user.display_name, children: /* @__PURE__ */ jsx(Avatar, { src: user.avatar, size: "md", circle: true }) }, user.id))
      ] }),
      entry.permissions["files.update"] && /* @__PURE__ */ jsx(
        Button,
        {
          className: "block mt-20",
          variant: "link",
          color: "primary",
          onClick: () => {
            driveState().setActiveActionDialog("share", [entry]);
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Manage Access" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(PropertyList, { entry }),
    /* @__PURE__ */ jsx(DetailsSidebarTags, { entry })
  ] });
}
function PropertyList({ entry }) {
  const parent = useSelectedEntryParent();
  const navigate = useNavigate$1();
  const owner = entry.users.find((user) => user.owns_entry);
  const prettySize = useMemo(
    () => prettyBytes(entry.file_size),
    [entry.file_size]
  );
  return /* @__PURE__ */ jsxs("div", { className: "mt-20 border-t pt-20", children: [
    /* @__PURE__ */ jsx(DetailsSidebarSectionHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Properties" }) }),
    /* @__PURE__ */ jsx(
      PropertyItem,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Type" }),
        value: /* @__PURE__ */ jsx("span", { className: "capitalize", children: /* @__PURE__ */ jsx(Trans, { message: entry.type }) })
      }
    ),
    /* @__PURE__ */ jsx(
      PropertyItem,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Size" }),
        value: entry.file_size ? prettySize : "-"
      }
    ),
    /* @__PURE__ */ jsx(
      PropertyItem,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Location" }),
        value: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "link",
            startIcon: /* @__PURE__ */ jsx(FolderIcon, {}),
            onClick: () => {
              navigate(
                parent ? getPathForFolder(parent.hash) : RootFolderPage.path
              );
            },
            children: parent ? parent.name : /* @__PURE__ */ jsx(Trans, { message: "Root" })
          }
        )
      }
    ),
    owner && /* @__PURE__ */ jsx(
      PropertyItem,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Owner" }),
        value: owner.display_name
      }
    ),
    /* @__PURE__ */ jsx(
      PropertyItem,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Modified" }),
        value: /* @__PURE__ */ jsx(FormattedDate, { date: entry.updated_at })
      }
    ),
    /* @__PURE__ */ jsx(
      PropertyItem,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Created" }),
        value: /* @__PURE__ */ jsx(FormattedDate, { date: entry.updated_at })
      }
    )
  ] });
}
function PropertyItem({ label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-14", children: [
    /* @__PURE__ */ jsx("div", { className: "w-1/3 text-xs text-muted", children: label }),
    /* @__PURE__ */ jsx("div", { className: "w-2/3 text-sm text-main", children: value })
  ] });
}
function DetailsSidebar({ className }) {
  const selectedEntry = useSelectedEntry();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        className,
        "bg p-18 text-sm text-muted border-l h-full overflow-y-auto"
      ),
      children: selectedEntry ? /* @__PURE__ */ jsx(DetailsSidebarProperties, { entry: selectedEntry }) : /* @__PURE__ */ jsx(NothingSelected, {})
    }
  );
}
function NothingSelected() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DetailsSidebarHeader,
      {
        entryType: "folder",
        entryName: /* @__PURE__ */ jsx(Trans, { message: "All files" })
      }
    ),
    /* @__PURE__ */ jsx(
      IllustratedMessage,
      {
        image: /* @__PURE__ */ jsx(SvgImage, { src: detailedExamination }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Select file or folder to see details here" })
      }
    )
  ] });
}
function useRenameEntry(form) {
  return useMutation({
    mutationFn: (payload) => renameEntry(payload),
    onSuccess: (r, p) => {
      invalidateEntryQueries();
      toast(
        message(":oldName renamed to :newName", {
          values: { oldName: p.initialName, newName: r.fileEntry.name }
        })
      );
    },
    onError: (err) => onFormQueryError(err, form)
  });
}
function renameEntry({ entryId, ...payload }) {
  return apiClient.put(`file-entries/${entryId}`, payload).then((response) => response.data);
}
function RenameEntryDialog({ entries }) {
  var _a2;
  const { close, formId } = useDialogContext();
  const initialName = (_a2 = entries[0]) == null ? void 0 : _a2.name;
  const form = useForm({ defaultValues: { name: initialName } });
  const renameEntry2 = useRenameEntry(form);
  const onSubmit = (e) => {
    renameEntry2.mutate(
      {
        entryId: entries[0].id,
        name: e.name,
        initialName
      },
      { onSuccess: close }
    );
  };
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Rename" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(Form, { onSubmit, form, id: formId, children: /* @__PURE__ */ jsx(
      FormTextField,
      {
        placeholder: "Enter a name...",
        "aria-label": "Entry name",
        autoFocus: true,
        name: "name",
        required: true,
        minLength: 3,
        maxLength: 200
      }
    ) }) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "flat", onClick: () => close(), children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          form: formId,
          type: "submit",
          variant: "flat",
          color: "primary",
          disabled: renameEntry2.isPending || !form.formState.isDirty,
          children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
        }
      )
    ] })
  ] });
}
function createFolder({ name, parentId }) {
  return apiClient.post("folders", {
    name,
    parentId: parentId === 0 ? null : parentId
  }).then((response) => response.data);
}
function useCreateFolder(form) {
  return useMutation({
    mutationFn: ({ name, parentId }) => {
      return createFolder({ name, parentId });
    },
    onSuccess: () => invalidateEntryQueries(),
    onError: (r) => onFormQueryError(r, form)
  });
}
function NewFolderDialog({ parentId }) {
  const { close, formId } = useDialogContext();
  const { trans } = useTrans();
  const form = useForm({
    defaultValues: {
      name: trans({ message: "Untitled Folder" })
    }
  });
  const createFolder2 = useCreateFolder(form);
  const onSubmit = (value) => {
    createFolder2.mutate(
      { ...value, parentId },
      {
        onSuccess: (response) => {
          close(response.folder);
          toast(message("Folder created"));
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "New Folder" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(Form, { onSubmit, form, id: formId, children: /* @__PURE__ */ jsx(
      FormTextField,
      {
        placeholder: trans({
          message: "Enter a name..."
        }),
        "aria-label": "Entry name",
        autoFocus: true,
        autoSelectText: true,
        name: "name",
        required: true,
        minLength: 3,
        maxLength: 200
      }
    ) }) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "flat", onClick: () => close(), children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          form: formId,
          type: "submit",
          variant: "flat",
          color: "primary",
          disabled: createFolder2.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Create" })
        }
      )
    ] })
  ] });
}
function EntryPreviewDialog({ selectedEntry }) {
  const files = useEntries().filter((entry) => entry.type !== "folder");
  const defaultActiveIndex = files.findIndex(
    (file) => file.id === (selectedEntry == null ? void 0 : selectedEntry.id)
  );
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  return /* @__PURE__ */ jsx(
    FilePreviewDialog,
    {
      allowDownload: selectedEntry.permissions["files.download"],
      headerActionsLeft: /* @__PURE__ */ jsx(DriveActions, { activeIndex, entries: files }),
      activeIndex,
      onActiveIndexChange: setActiveIndex,
      entries: files
    }
  );
}
function DriveActions({ activeIndex, entries }) {
  const selectedEntry = entries[activeIndex];
  const share = useShareAction([selectedEntry]);
  if (!selectedEntry || !share)
    return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        className: "md:hidden",
        onClick: () => {
          share.execute();
        },
        children: createElement(share.icon)
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        className: "max-md:hidden",
        variant: "text",
        startIcon: createElement(share.icon),
        onClick: () => {
          share.execute();
        },
        children: /* @__PURE__ */ jsx(Trans, { ...share.label })
      }
    )
  ] });
}
function shareEntry({
  entryId,
  ...payload
}) {
  return apiClient.post(`file-entries/${entryId}/share`, payload).then((response) => response.data);
}
function useShareEntry() {
  return useMutation({
    mutationFn: (payload) => shareEntry(payload),
    onSuccess: () => {
      invalidateEntryQueries();
    },
    onError: (err) => {
      var _a2, _b2;
      if (axios.isAxiosError(err) && err.response) {
        const response = err.response.data;
        if ((_a2 = response.errors) == null ? void 0 : _a2.emails) {
          toast.danger((_b2 = response.errors) == null ? void 0 : _b2.emails[0]);
        } else {
          showHttpErrorToast(err);
        }
      }
    }
  });
}
const DRIVE_ENTRY_FULL_PERMISSIONS = {
  edit: true,
  view: true,
  download: true
};
const PermissionSelectorItems = [
  {
    key: "view",
    value: { view: true },
    label: message("Can view")
  },
  {
    key: "download",
    value: { view: true, download: true },
    label: message("Can Download")
  },
  {
    key: "edit",
    value: DRIVE_ENTRY_FULL_PERMISSIONS,
    label: message("Can edit")
  }
];
function PermissionSelector({ value, onChange }) {
  return /* @__PURE__ */ jsxs(
    MenuTrigger,
    {
      selectedValue: value.key,
      selectionMode: "single",
      onSelectionChange: (key) => {
        if (key !== value.key) {
          onChange(PermissionSelectorItems.find((p) => p.key === key));
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "flat",
            color: "chip",
            size: "xs",
            endIcon: /* @__PURE__ */ jsx(ArrowDropDownIcon, {}),
            children: /* @__PURE__ */ jsx(Trans, { ...value.label })
          }
        ),
        /* @__PURE__ */ jsx(Menu, { children: PermissionSelectorItems.map((item) => {
          return /* @__PURE__ */ jsx(Item, { value: item.key, children: /* @__PURE__ */ jsx(Trans, { ...item.label }) }, item.key);
        }) })
      ]
    }
  );
}
function getPermissionItemForUser(user) {
  const { download, edit } = user.entry_permissions;
  if (edit) {
    return PermissionSelectorItems.find((item) => item.key === "edit");
  }
  if (download) {
    return PermissionSelectorItems.find((item) => item.key === "download");
  }
  return PermissionSelectorItems.find((item) => item.key === "view");
}
function useChangePermission() {
  return useMutation({
    mutationFn: (payload) => changePermission(payload),
    onSuccess: () => {
      invalidateEntryQueries();
      toast(message("Updated user permissions"));
    },
    onError: (err) => showHttpErrorToast(err, message("Could not update permissions"))
  });
}
function changePermission({
  entryId,
  ...payload
}) {
  return apiClient.put(`file-entries/${entryId}/change-permissions`, payload).then((response) => response.data);
}
function UserAvatar({ user, ...props }) {
  var _a2;
  const { auth } = useContext(SiteConfigContext);
  return /* @__PURE__ */ jsx(
    Avatar,
    {
      ...props,
      label: user == null ? void 0 : user.display_name,
      src: user == null ? void 0 : user.avatar,
      link: (user == null ? void 0 : user.id) && ((_a2 = auth.getUserProfileLink) == null ? void 0 : _a2.call(auth, user))
    }
  );
}
function MemberList({ className, entry }) {
  if (!entry)
    return null;
  const users = entry.users;
  return /* @__PURE__ */ jsxs("div", { className: clsx(className, "overflow-hidden"), children: [
    /* @__PURE__ */ jsx("div", { className: "mb-14 text-sm", children: /* @__PURE__ */ jsx(Trans, { message: "Who has access" }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: users.map((user) => {
      return /* @__PURE__ */ jsx(MemberListItem, { user, entry }, user.id);
    }) })
  ] });
}
function MemberListItem({ user, entry }) {
  return /* @__PURE__ */ jsxs(
    m.div,
    {
      initial: { x: "-100%", opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: "100%", opacity: 0 },
      transition: { type: "tween", duration: 0.125 },
      className: "flex items-center text-sm gap-14 mb-20",
      children: [
        /* @__PURE__ */ jsx(UserAvatar, { user, circle: true, size: "w-44 h-44" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { children: user.display_name }),
          /* @__PURE__ */ jsx("div", { className: "text-muted", children: user.email })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "ml-auto", children: user.owns_entry ? /* @__PURE__ */ jsx("span", { className: "text-muted", children: /* @__PURE__ */ jsx(Trans, { message: "Owner" }) }) : /* @__PURE__ */ jsx(ActionButtons, { user, entry }) })
      ]
    },
    user.id
  );
}
function ActionButtons({ user, entry }) {
  const changePermissions = useChangePermission();
  const unshareEntry = useUnshareEntries();
  const [activePermission, setActivePermission] = useState(() => {
    return getPermissionItemForUser(user);
  });
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-10", children: [
    /* @__PURE__ */ jsx(
      PermissionSelector,
      {
        onChange: (item) => {
          changePermissions.mutate({
            userId: user.id,
            permissions: item.value,
            entryId: entry.id
          });
          setActivePermission(item);
        },
        value: activePermission
      }
    ),
    /* @__PURE__ */ jsx(
      IconButton,
      {
        onClick: () => {
          unshareEntry.mutate(
            { userId: user.id, entryIds: [entry.id] },
            {
              onSuccess: () => {
                toast(message("Member removed"));
              },
              onError: (err) => showHttpErrorToast(err, message("Could not remove member"))
            }
          );
        },
        children: /* @__PURE__ */ jsx(CloseIcon, {})
      }
    )
  ] });
}
function SharePanel({ className, entry }) {
  var _a2;
  const { trans } = useTrans();
  const { share } = useSettings();
  const shareEntry2 = useShareEntry();
  const [chips, setChips] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(PermissionSelectorItems[0]);
  const allEmailsValid = chips.every((chip) => !chip.invalid);
  const [inputValue, setInputValue] = useState("");
  const query = useNormalizedModels(
    "normalized-models/user",
    { perPage: 7, query: inputValue },
    { enabled: share.suggest_emails }
  );
  const displayWith = (chip) => chip.description || chip.name;
  return /* @__PURE__ */ jsxs("div", { className, children: [
    /* @__PURE__ */ jsx(
      ChipField,
      {
        value: chips,
        onChange: setChips,
        isAsync: true,
        isLoading: query.fetchStatus === "fetching",
        inputValue,
        onInputValueChange: setInputValue,
        suggestions: (_a2 = query.data) == null ? void 0 : _a2.results,
        displayWith,
        validateWith: (chip) => {
          const invalid = !isEmail(chip.description);
          return {
            ...chip,
            invalid,
            errorMessage: invalid ? trans({ message: "Not a valid email" }) : void 0
          };
        },
        placeholder: trans({ message: "Enter email addresses" }),
        label: /* @__PURE__ */ jsx(Trans, { message: "Invite people" }),
        children: (user) => /* @__PURE__ */ jsx(
          Item,
          {
            value: user.id,
            startIcon: /* @__PURE__ */ jsx(Avatar, { circle: true, src: user.image, alt: "" }),
            description: user.description,
            children: user.name
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-14 flex items-center justify-between gap-14", children: [
      /* @__PURE__ */ jsx(
        PermissionSelector,
        {
          onChange: setSelectedPermission,
          value: selectedPermission
        }
      ),
      chips.length ? /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          size: "sm",
          disabled: isSharing || !allEmailsValid,
          onClick: () => {
            setIsSharing(true);
            shareEntry2.mutate(
              {
                emails: chips.map((c) => displayWith(c)),
                permissions: selectedPermission.value,
                entryId: entry.id
              },
              {
                onSuccess: () => {
                  setChips([]);
                },
                onSettled: () => {
                  setIsSharing(false);
                }
              }
            );
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Share" })
        }
      ) : null
    ] }),
    /* @__PURE__ */ jsx(MemberList, { className: "mt-30", entry })
  ] });
}
function useEntryShareableLink(entryId) {
  return useQuery({
    queryKey: DriveQueryKeys.fetchEntryShareableLink(entryId),
    queryFn: () => fetchLinkByEntryId(entryId),
    enabled: !!entryId
  });
}
function fetchLinkByEntryId(entryId) {
  return apiClient.get(`file-entries/${entryId}/shareable-link`, {
    params: { loader: "shareableLink" }
  }).then((response) => response.data);
}
function deleteShareableLink({
  entryId
}) {
  return apiClient.delete(`file-entries/${entryId}/shareable-link`).then((r) => r.data);
}
function useDeleteShareableLink() {
  return useMutation({
    mutationFn: ({ entryId }) => deleteShareableLink({ entryId }),
    onSuccess: (response, { entryId }) => {
      queryClient.setQueryData(
        DriveQueryKeys.fetchEntryShareableLink(entryId),
        { ...response, link: null }
      );
    },
    onError: (err) => showHttpErrorToast(err, message("Could not delete link"))
  });
}
function randomString(length = 36) {
  let random = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i += 1) {
    random += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return random;
}
function ShareableLinkPanel({
  setActivePanel,
  entry,
  focusInput
}) {
  var _a2, _b2;
  const query = useEntryShareableLink(entry.id);
  const linkExists = !!((_a2 = query.data) == null ? void 0 : _a2.link);
  const createLink = useCreateShareableLink();
  const deleteLink = useDeleteShareableLink();
  const isLoading = query.isLoading || createLink.isPending || deleteLink.isPending;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-10", children: /* @__PURE__ */ jsx(Trans, { message: "Share link" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-14 px-2 pb-4", children: [
      /* @__PURE__ */ jsx(
        Switch,
        {
          checked: linkExists,
          disabled: isLoading,
          onChange: () => {
            if (linkExists) {
              deleteLink.mutate({ entryId: entry.id });
            } else {
              createLink.mutate({ entryId: entry.id });
            }
          },
          children: linkExists ? /* @__PURE__ */ jsx(Trans, { message: "Shareable link is created" }) : /* @__PURE__ */ jsx(Trans, { message: "Create shareable link" })
        }
      ),
      linkExists && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "link",
          color: "primary",
          onClick: () => {
            setActivePanel("linkSettings");
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Link settings" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(ShareableLinkInput, { autoFocus: focusInput, link: (_b2 = query.data) == null ? void 0 : _b2.link })
  ] });
}
function ShareableLinkInput({ link, autoFocus }) {
  const { base_url } = useSettings();
  const { trans } = useTrans();
  const entry = useActiveDialogEntry();
  const hash = (link == null ? void 0 : link.hash) || (entry == null ? void 0 : entry.hash) || randomString();
  const linkUrl = `${base_url}/drive/s/${hash}`;
  const [isCopied, setCopied] = useClipboard(linkUrl, {
    successDuration: 1e3
  });
  return /* @__PURE__ */ jsx(
    TextField,
    {
      autoFocus,
      disabled: !link,
      className: "mt-10",
      readOnly: true,
      value: linkUrl,
      "aria-label": trans({ message: "Shareable link" }),
      onFocus: (e) => {
        e.target.select();
      },
      endAppend: /* @__PURE__ */ jsx(
        Button,
        {
          className: "min-w-100",
          variant: "flat",
          color: "primary",
          onClick: setCopied,
          children: isCopied ? /* @__PURE__ */ jsx(Trans, { message: "Copied!" }) : /* @__PURE__ */ jsx(Trans, { message: "Copy" })
        }
      )
    }
  );
}
function updateShareableLink({
  entryId,
  ...payload
}) {
  return apiClient.put(`file-entries/${entryId}/shareable-link`, payload).then((response) => response.data);
}
function useUpdateShareableLink(form) {
  return useMutation({
    mutationFn: (payload) => updateShareableLink(payload),
    onSuccess: (data, { entryId }) => {
      queryClient.setQueryData(
        DriveQueryKeys.fetchEntryShareableLink(entryId),
        data
      );
    },
    onError: (r) => onFormQueryError(r, form)
  });
}
function LinkSettingsDialog({
  className,
  setActivePanel,
  entry
}) {
  const { formId } = useDialogContext();
  const { data } = useEntryShareableLink(entry.id);
  const link = data == null ? void 0 : data.link;
  const form = useForm({
    defaultValues: {
      allowDownload: link == null ? void 0 : link.allow_download,
      allowEdit: link == null ? void 0 : link.allow_edit,
      expiresAt: link == null ? void 0 : link.expires_at,
      entryId: entry.id
    }
  });
  const updateLink = useUpdateShareableLink(form);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DialogHeader,
      {
        onDismiss: () => {
          setActivePanel("main");
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Shareable Link Settings" })
      }
    ),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      m.div,
      {
        className: "min-h-[335px]",
        animate: { opacity: 1, y: 0 },
        initial: { opacity: 0, y: 20 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.1 },
        children: /* @__PURE__ */ jsxs(
          Form,
          {
            id: formId,
            className,
            form,
            onSubmit: (value) => {
              updateLink.mutate(value, {
                onSuccess: () => {
                  setActivePanel("main");
                  toast(message("Link settings saved"));
                }
              });
            },
            children: [
              /* @__PURE__ */ jsx(LinkExpirationOption, { showField: !!(link == null ? void 0 : link.expires_at) }),
              /* @__PURE__ */ jsx(LinkPasswordOption, { showField: !!(link == null ? void 0 : link.password) }),
              /* @__PURE__ */ jsxs(LinkOption, { children: [
                /* @__PURE__ */ jsx(Trans, { message: "Allow download" }),
                /* @__PURE__ */ jsx(FormSwitch, { name: "allowDownload", children: /* @__PURE__ */ jsx(Trans, { message: "Users with link can download this item" }) })
              ] }),
              /* @__PURE__ */ jsxs(LinkOption, { showBorder: false, children: [
                /* @__PURE__ */ jsx(Trans, { message: "Allow import" }),
                /* @__PURE__ */ jsx(FormSwitch, { name: "allowEdit", children: /* @__PURE__ */ jsx(Trans, { message: "Users with link can import this item into their own drive" }) })
              ] })
            ]
          }
        )
      },
      "link-settings-content"
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          onClick: () => {
            setActivePanel("main");
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          form: formId,
          variant: "flat",
          color: "primary",
          disabled: updateLink.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
        }
      )
    ] })
  ] });
}
const minDate = now(getLocalTimeZone());
function LinkExpirationOption({
  showField: showFieldDefault
}) {
  const { trans } = useTrans();
  const [showField, setShowField] = useState(showFieldDefault);
  return /* @__PURE__ */ jsxs(LinkOption, { children: [
    /* @__PURE__ */ jsx(Trans, { message: "Link expiration" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        Switch,
        {
          checked: showField,
          onChange: (e) => {
            setShowField(e.target.checked);
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Link is valid until" })
        }
      ),
      showField && /* @__PURE__ */ jsx(
        FormDatePicker,
        {
          min: minDate,
          name: "expiresAt",
          granularity: "minute",
          className: "mt-20",
          "aria-label": trans({
            message: "Link expiration date and time"
          })
        }
      )
    ] })
  ] });
}
function LinkPasswordOption({
  showField: showFieldDefault
}) {
  const { trans } = useTrans();
  const [showField, setShowField] = useState(showFieldDefault);
  return /* @__PURE__ */ jsxs(LinkOption, { children: [
    /* @__PURE__ */ jsx(Trans, { message: "Password protect" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        Switch,
        {
          checked: showField,
          onChange: (e) => {
            setShowField(e.target.checked);
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Users will need to enter password in order to view this link" })
        }
      ),
      showField && /* @__PURE__ */ jsx(
        FormTextField,
        {
          type: "password",
          autoFocus: true,
          name: "password",
          className: "mt-20",
          "aria-label": trans({ message: "Link password" }),
          description: /* @__PURE__ */ jsx(Trans, { message: "Password will not be requested when viewing the link as file owner." }),
          placeholder: trans({
            message: "Enter new password..."
          })
        }
      )
    ] })
  ] });
}
function LinkOption({ children, showBorder = true }) {
  const [title, content] = children;
  return /* @__PURE__ */ jsxs("div", { className: clsx(showBorder && "mb-20 border-b pb-20"), children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8 text-sm font-medium", children: title }),
    content
  ] });
}
function ShareDialog({
  entry: initialEntry,
  focusLinkInput
}) {
  const {
    data: { fileEntry }
  } = useQuery({
    queryKey: DriveQueryKeys.fetchFileEntry(initialEntry.id),
    queryFn: () => apiClient.get(`drive/file-entries/${initialEntry.id}/model`).then((response) => response.data),
    initialData: { fileEntry: initialEntry }
  });
  const [activePanel, setActivePanel] = useState("main");
  return /* @__PURE__ */ jsx(Dialog, { size: "lg", children: /* @__PURE__ */ jsx(AnimatePresence, { initial: false, mode: "wait", children: activePanel === "linkSettings" ? /* @__PURE__ */ jsx(
    LinkSettingsDialog,
    {
      setActivePanel,
      entry: fileEntry
    },
    "one"
  ) : /* @__PURE__ */ jsx(
    MainDialog,
    {
      setActivePanel,
      entry: fileEntry,
      focusLinkInput
    },
    "two"
  ) }) });
}
function MainDialog({ setActivePanel, entry, focusLinkInput }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Share ‘:name’", values: { name: entry.name } }) }),
    /* @__PURE__ */ jsx(DialogBody, { className: "relative", children: /* @__PURE__ */ jsxs(
      m.div,
      {
        animate: { opacity: 1, y: 0 },
        initial: { opacity: 0, y: 20 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.1 },
        children: [
          /* @__PURE__ */ jsx(SharePanel, { className: "mb-30 border-b pb-30", entry }),
          /* @__PURE__ */ jsx(
            ShareableLinkPanel,
            {
              setActivePanel,
              entry,
              focusInput: !!focusLinkInput
            }
          )
        ]
      },
      "share-content"
    ) })
  ] });
}
function MoveEntriesDialogSearch({
  allFolders,
  onFolderSelected
}) {
  const { trans } = useTrans();
  const searchLabel = trans({ message: "Search folders" });
  return /* @__PURE__ */ jsx(
    ComboBoxForwardRef,
    {
      size: "sm",
      maxItems: 10,
      placeholder: searchLabel,
      "aria-label": searchLabel,
      className: "pt-20",
      endAdornmentIcon: /* @__PURE__ */ jsx(SearchIcon, {}),
      items: allFolders,
      clearInputOnItemSelection: true,
      onItemSelected: (value) => {
        const folderId = parseInt(value);
        const folder = allFolders.find((f) => f.id === folderId);
        if (folder) {
          onFolderSelected(folder);
        }
      },
      children: (item) => /* @__PURE__ */ jsx(Item, { value: item.id, children: item.name }, item.id)
    }
  );
}
function MoveEntriesDialogBreadcrumbs({
  selectedFolder,
  allFolders,
  rootFolder: rootFolder2,
  onFolderSelected
}) {
  const path = selectedFolder.path.split("/").map((part) => {
    const folderId = parseInt(part);
    return allFolders.find((folder) => folderId === folder.id);
  }).filter((f) => !!f);
  const fullPath = [rootFolder2, ...path];
  const previous = path[path.length - 2];
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 border-b pb-10", children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        className: "flex-shrink-0",
        variant: "outline",
        size: "xs",
        disabled: !previous && !selectedFolder.id,
        onClick: () => {
          onFolderSelected(previous || rootFolder2);
        },
        children: /* @__PURE__ */ jsx(ArrowBackIcon, {})
      }
    ),
    /* @__PURE__ */ jsx(Breadcrumb, { size: "sm", className: "flex-auto", children: fullPath.map((item) => {
      return /* @__PURE__ */ jsxs(
        BreadcrumbItem,
        {
          onSelected: () => {
            onFolderSelected(item);
          },
          className: "flex items-center gap-8",
          children: [
            !item.id && /* @__PURE__ */ jsx(FolderIcon, { className: "icon-sm" }),
            item.name
          ]
        },
        item.id || "root"
      );
    }) })
  ] });
}
const myFilesSvg = "/assets/my-files-88476671.svg";
function MoveEntriesDialogFolderList(props) {
  const { onFolderSelected, selectedFolder, allFolders } = props;
  const subFolders = useMemo(() => {
    const parentId = selectedFolder.id || null;
    return allFolders.filter((f) => f.parent_id === parentId);
  }, [selectedFolder.id, allFolders]);
  if (!subFolders.length) {
    return /* @__PURE__ */ jsx(
      IllustratedMessage,
      {
        size: "xs",
        className: "pt-64 pb-20 min-h-288",
        image: /* @__PURE__ */ jsx(SvgImage, { src: myFilesSvg }),
        title: /* @__PURE__ */ jsx(
          Trans,
          {
            message: `There are no subfolders in ":folder"`,
            values: { folder: selectedFolder.name }
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsx(List, { className: "h-288 overflow-y-auto", children: subFolders.map((folder) => {
    return /* @__PURE__ */ jsx(
      ListItem,
      {
        className: "border-b min-h-48",
        onSelected: () => {
          onFolderSelected(folder);
        },
        startIcon: /* @__PURE__ */ jsx(FileTypeIcon, { type: "folder" }),
        endIcon: /* @__PURE__ */ jsx(ChevronRightIcon, { size: "md" }),
        children: folder.name
      },
      folder.id
    );
  }) });
}
function MoveEntriesDialog({ entries }) {
  const { data } = useFolders();
  const allFolders = (data == null ? void 0 : data.folders) || [];
  const activePage = useDriveStore((s) => s.activePage);
  const [selectedFolder, setSelectedFolder] = useState(
    (activePage == null ? void 0 : activePage.folder) || RootFolderPage.folder
  );
  return /* @__PURE__ */ jsxs(Dialog, { size: "lg", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(
      Trans,
      {
        message: "Move [one ‘:name‘|other :count items]",
        values: {
          count: entries.length,
          name: entries[0].name
        }
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogBody, { children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm", children: /* @__PURE__ */ jsx(Trans, { message: "Select a destination folder." }) }),
      /* @__PURE__ */ jsx(
        MoveEntriesDialogSearch,
        {
          allFolders,
          onFolderSelected: setSelectedFolder
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mb-20 mt-40", children: [
        /* @__PURE__ */ jsx(
          MoveEntriesDialogBreadcrumbs,
          {
            selectedFolder,
            allFolders,
            rootFolder: RootFolderPage.folder,
            onFolderSelected: setSelectedFolder
          }
        ),
        /* @__PURE__ */ jsx(
          MoveEntriesDialogFolderList,
          {
            selectedFolder,
            allFolders,
            onFolderSelected: setSelectedFolder
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      Footer,
      {
        selectedFolder,
        setSelectedFolder,
        entries
      }
    )
  ] });
}
function Footer({ selectedFolder, setSelectedFolder, entries }) {
  const { close } = useDialogContext();
  const moveEntries2 = useMoveEntries();
  return /* @__PURE__ */ jsxs(
    DialogFooter,
    {
      className: "border-t",
      startAction: /* @__PURE__ */ jsxs(
        DialogTrigger,
        {
          type: "modal",
          onClose: (folder) => {
            if (folder) {
              setSelectedFolder(folder);
            }
          },
          children: [
            /* @__PURE__ */ jsx(Button, { startIcon: /* @__PURE__ */ jsx(CreateNewFolderIcon, {}), variant: "text", children: /* @__PURE__ */ jsx(Trans, { message: "New Folder" }) }),
            /* @__PURE__ */ jsx(NewFolderDialog, { parentId: selectedFolder.id })
          ]
        }
      ),
      children: [
        /* @__PURE__ */ jsx(Button, { className: "max-md:hidden", variant: "flat", onClick: () => close(), children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            variant: "flat",
            color: "primary",
            disabled: !canMoveEntriesInto(entries, selectedFolder) || moveEntries2.isPending,
            onClick: () => {
              moveEntries2.mutate(
                {
                  destinationId: selectedFolder.id,
                  entryIds: entries.map((e) => e.id)
                },
                { onSuccess: close }
              );
            },
            children: /* @__PURE__ */ jsx(Trans, { message: "Move here" })
          }
        )
      ]
    }
  );
}
function DeleteEntriesForeverDialog({
  entries
}) {
  const deleteEntries2 = useDeleteEntries();
  const { close } = useDialogContext();
  const message2 = entries.length === 1 ? /* @__PURE__ */ jsx(
    Trans,
    {
      message: "‘:name‘ will be deleted forever and you won't be able to restore it.",
      values: { name: entries[0].name }
    }
  ) : /* @__PURE__ */ jsx(
    Trans,
    {
      message: ":count items will be deleted forever and you won't be able to restore them.",
      values: { count: entries.length }
    }
  );
  return /* @__PURE__ */ jsx(
    ConfirmationDialog,
    {
      isDanger: true,
      title: /* @__PURE__ */ jsx(Trans, { message: "Delete forever?" }),
      body: message2,
      confirm: /* @__PURE__ */ jsx(Trans, { message: "Delete forever" }),
      isLoading: deleteEntries2.isPending,
      onConfirm: () => {
        deleteEntries2.mutate(
          {
            entryIds: entries.map((e) => e.id),
            deleteForever: true
          },
          {
            onSuccess: () => {
              close();
              driveState().selectEntries([]);
            }
          }
        );
      }
    }
  );
}
function BlockTrashFolderViewDialog({
  entries
}) {
  const restoreEntries2 = useRestoreEntries();
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsx(
    ConfirmationDialog,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "This folder is in your trash" }),
      body: /* @__PURE__ */ jsx(Trans, { message: "To view this folder, restore it from the trash." }),
      confirm: /* @__PURE__ */ jsx(Trans, { message: "Restore" }),
      isLoading: restoreEntries2.isPending,
      onConfirm: () => {
        restoreEntries2.mutate(
          {
            entryIds: entries.map((e) => e.id)
          },
          {
            onSuccess: () => {
              close();
              driveState().selectEntries([]);
            }
          }
        );
      }
    }
  );
}
function DriveDialogsContainer() {
  const activeDialog = useDriveStore((s) => s.activeActionDialog);
  const dialog = getDialog(activeDialog);
  return /* @__PURE__ */ jsx(
    DialogTrigger,
    {
      type: "modal",
      isOpen: !!dialog,
      onClose: () => {
        driveState().setActiveActionDialog(null);
      },
      children: dialog
    }
  );
}
function getDialog(dialog) {
  var _a2;
  switch (dialog == null ? void 0 : dialog.name) {
    case "rename":
      return /* @__PURE__ */ jsx(RenameEntryDialog, { entries: dialog.entries });
    case "newFolder":
      return /* @__PURE__ */ jsx(NewFolderDialog, { parentId: (_a2 = dialog.entries[0]) == null ? void 0 : _a2.id });
    case "preview":
      return /* @__PURE__ */ jsx(EntryPreviewDialog, { selectedEntry: dialog.entries[0] });
    case "share":
      return /* @__PURE__ */ jsx(ShareDialog, { entry: dialog.entries[0] });
    case "getLink":
      return /* @__PURE__ */ jsx(ShareDialog, { entry: dialog.entries[0], focusLinkInput: true });
    case "moveTo":
      return /* @__PURE__ */ jsx(MoveEntriesDialog, { entries: dialog.entries });
    case "confirmAndDeleteForever":
      return /* @__PURE__ */ jsx(DeleteEntriesForeverDialog, { entries: dialog.entries });
    case "trashFolderBlock":
      return /* @__PURE__ */ jsx(BlockTrashFolderViewDialog, { entries: dialog.entries });
    default:
      return null;
  }
}
function NavbarSearch() {
  const { trans } = useTrans();
  const navigate = useNavigate$1();
  const activePage = useDriveStore((s) => s.activePage);
  const [searchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchParams.get("query") || "");
  return /* @__PURE__ */ jsx(
    "form",
    {
      className: "max-w-620 flex-auto",
      onSubmit: (e) => {
        e.preventDefault();
        navigate(
          {
            pathname: SearchPage.path,
            search: `?query=${inputValue}`
          },
          { replace: true }
        );
      },
      children: /* @__PURE__ */ jsx(
        TextField,
        {
          size: "sm",
          background: "bg",
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          onFocus: () => {
            if (activePage !== SearchPage) {
              navigate(SearchPage.path);
            }
          },
          startAdornment: /* @__PURE__ */ jsx(IconButton, { type: "submit", children: /* @__PURE__ */ jsx(SearchIcon, {}) }),
          className: "max-w-620 flex-auto",
          placeholder: trans({ message: "Search" }),
          "aria-label": trans({ message: "Search files and folders" })
        }
      )
    }
  );
}
function useDragMonitor(monitor) {
  const monitorRef = useRef(monitor);
  const id = useId();
  useEffect(() => {
    dragMonitors.set(id, monitorRef.current);
    return () => {
      dragMonitors.delete(id);
    };
  }, [id]);
}
function EntryDragPreview() {
  const ref = useRef(null);
  const [points, setPoints] = useState();
  const [state, setState] = useState({});
  useDragMonitor({
    type: "fileEntry",
    onDragStart: (e, dragTarget) => {
      const target = dragTarget;
      if (target) {
        setState({
          entries: target.getData(),
          e,
          draggingTreeItem: isFolderTreeDragId(target.id)
        });
        setPoints({ start: e });
      }
    },
    onDragMove: (e) => {
      setState((prev) => {
        return { ...prev, e };
      });
      setPoints((prev) => {
        return { ...prev, end: e };
      });
    },
    onDragEnd: (e, dragTarget, status) => {
      setState({ status });
    }
  });
  let preview = null;
  if (state.entries && state.e) {
    preview = /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        style: state.e ? {
          transform: `translate(${state.e.x}px, ${state.e.y}px)`,
          width: `${state.e.rect.width}px`
        } : void 0,
        className: "fixed isolate left-0 top-0 pointer-events-none",
        children: state.entries.map((item, index) => /* @__PURE__ */ jsx(
          EntryPreview,
          {
            index,
            entry: item,
            points,
            state
          },
          item.id
        ))
      }
    );
  }
  return /* @__PURE__ */ jsx(AnimatePresence, { custom: state.status, children: preview });
}
const EntryPreview = memo(
  ({ entry, points, index, state }) => {
    var _a2, _b2, _c, _d;
    const viewMode = useDriveStore((s) => s.viewMode);
    const droppableId = state.draggingTreeItem ? makeFolderTreeDragId(entry) : entry.id;
    const target = droppables.get(droppableId);
    if (!(target == null ? void 0 : target.rect) || !(points == null ? void 0 : points.start))
      return null;
    const rect = target.rect;
    const itemCount = ((_a2 = state.entries) == null ? void 0 : _a2.length) || 0;
    const exitVariant = (status) => {
      var _a3, _b3, _c2;
      if (status === "dropSuccess") {
        return {
          x: 0,
          y: 0,
          opacity: 0,
          transition: { duration: 0.1, delay: 0 }
        };
      }
      return {
        x: rect.left - (((_a3 = points.end) == null ? void 0 : _a3.x) || 0),
        y: rect.top - (((_b3 = points.end) == null ? void 0 : _b3.y) || 0),
        width: `${(_c2 = state.e) == null ? void 0 : _c2.rect.width}px`
      };
    };
    return /* @__PURE__ */ jsxs(
      m.div,
      {
        transition: { delay: 0.01 * index, bounce: 0, duration: 0.2 },
        initial: {
          x: rect.left - points.start.x,
          y: rect.top - points.start.y,
          width: `${(_b2 = state.e) == null ? void 0 : _b2.rect.width}px`
        },
        animate: {
          x: 0,
          y: 0,
          // in list/table mode limit preview size to 288px, but start and end the animation
          // at full width, so it returns to original position at original size smoothly
          width: viewMode === "list" ? 288 : void 0
        },
        exit: exitVariant,
        style: {
          // in grid mode simply use the width of the draggable item
          width: viewMode === "grid" ? `${(_c = state.e) == null ? void 0 : _c.rect.width}px` : void 0,
          height: `${(_d = state.e) == null ? void 0 : _d.rect.height}px`
        },
        className: clsx(
          "absolute bg-paper whitespace-nowrap rounded border border-primary-light max-h-48",
          index < 2 && "shadow",
          index === 0 && "z-10 top-0 left-0",
          index > 0 && "top-6 left-6"
        ),
        children: [
          itemCount > 1 && index === 0 && /* @__PURE__ */ jsx(EntryCount, { count: itemCount }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm h-full flex justify-center items-center px-16 gap-10 bg-primary-light/20 overflow-hidden", children: [
            /* @__PURE__ */ jsx(FileTypeIcon, { type: entry.type }),
            /* @__PURE__ */ jsx("div", { className: "flex-auto text-ellipsis overflow-hidden", children: entry.name })
          ] })
        ]
      },
      entry.id
    );
  }
);
const EntryCount = memo(({ count }) => {
  return /* @__PURE__ */ jsx(
    m.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { delay: 0.1 } },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
      className: "absolute -top-6 shadow-lg -right-6 z-30 rounded-full bg-danger text-white w-20 h-20 flex items-center justify-center text-sm font-bold z-10",
      children: count
    },
    "entryCount"
  );
});
function DriveContentHeader() {
  const { isMobileMode } = useContext(DashboardLayoutContext);
  const activePage = useDriveStore((s) => s.activePage);
  return /* @__PURE__ */ jsxs(DashboardContentHeader, { className: "px-8 md:px-26 py-4 flex items-center gap-20 border-b h-60", children: [
    isMobileMode ? /* @__PURE__ */ jsx(DriveSortButton, { isDisabled: activePage == null ? void 0 : activePage.disableSort }) : /* @__PURE__ */ jsx(PageBreadcrumbs, {}),
    /* @__PURE__ */ jsxs("div", { className: "text-muted ml-auto flex-shrink-0", children: [
      /* @__PURE__ */ jsx(ToggleViewModeButton, {}),
      /* @__PURE__ */ jsx(ToggleDetailsButton, {})
    ] })
  ] });
}
function ToggleViewModeButton() {
  const viewMode = useDriveStore((s) => s.viewMode);
  const tooltip = viewMode === "grid" ? /* @__PURE__ */ jsx(Trans, { message: "List view" }) : /* @__PURE__ */ jsx(Trans, { message: "Grid view" });
  return /* @__PURE__ */ jsx(Tooltip, { label: tooltip, children: /* @__PURE__ */ jsx(
    IconButton,
    {
      size: "md",
      onClick: () => {
        driveState().setViewMode(
          driveState().viewMode === "list" ? "grid" : "list"
        );
      },
      children: viewMode === "list" ? /* @__PURE__ */ jsx(ViewListIcon, {}) : /* @__PURE__ */ jsx(ViewModuleIcon, {})
    }
  ) });
}
function ToggleDetailsButton() {
  const { rightSidenavStatus: status, setRightSidenavStatus } = useContext(
    DashboardLayoutContext
  );
  const tooltip = status ? /* @__PURE__ */ jsx(Trans, { message: "Hide details" }) : /* @__PURE__ */ jsx(Trans, { message: "Show details" });
  return /* @__PURE__ */ jsx(Tooltip, { label: tooltip, children: /* @__PURE__ */ jsx(
    IconButton,
    {
      size: "md",
      color: status === "open" ? "primary" : null,
      onClick: () => {
        setRightSidenavStatus(status === "open" ? "closed" : "open");
      },
      children: /* @__PURE__ */ jsx(InfoIcon, {})
    }
  ) });
}
function DriveLayout() {
  const { pathname } = useLocation();
  const { hash } = useParams();
  const { workspaceId } = useActiveWorkspaceId();
  const activePage = useDriveStore((s) => s.activePage);
  useEffect(() => {
    driveState().setActivePage(
      DRIVE_PAGES.find((p) => p.path === pathname) || makePartialFolderPage(hash)
    );
  }, [pathname, hash]);
  const urlsContextValue = useMemo(() => {
    return { workspaceId };
  }, [workspaceId]);
  useEffect(() => {
    return () => {
      driveState().reset();
    };
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    (activePage == null ? void 0 : activePage.label) && /* @__PURE__ */ jsx(StaticPageTitle, { children: /* @__PURE__ */ jsx(
      Trans,
      {
        message: typeof activePage.label === "string" ? activePage.label : activePage.label.message
      }
    ) }),
    /* @__PURE__ */ jsxs(FileUploadProvider, { children: [
      /* @__PURE__ */ jsx(FileEntryUrlsContext.Provider, { value: urlsContextValue, children: /* @__PURE__ */ jsxs(
        DashboardLayout,
        {
          name: "drive",
          onDragOver: (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = "none";
          },
          onDrop: (e) => {
            e.preventDefault();
          },
          children: [
            /* @__PURE__ */ jsx(Navbar, {}),
            /* @__PURE__ */ jsx(DashboardSidenav, { position: "left", size: "md", children: /* @__PURE__ */ jsx(Sidebar, {}) }),
            /* @__PURE__ */ jsx(DriveContentHeader, {}),
            /* @__PURE__ */ jsx(DashboardContent, { children: /* @__PURE__ */ jsx(FileView, {}) }),
            /* @__PURE__ */ jsx(UploadQueue, {}),
            /* @__PURE__ */ jsx(DriveDialogsContainer, {}),
            /* @__PURE__ */ jsx(DashboardSidenav, { position: "right", size: "lg", children: /* @__PURE__ */ jsx(DetailsSidebar, {}) })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(EntryDragPreview, {})
    ] })
  ] });
}
function Navbar() {
  const { isMobileMode } = useContext(DashboardLayoutContext);
  const activePage = useDriveStore((s) => s.activePage);
  const children = isMobileMode ? null : /* @__PURE__ */ jsx(NavbarSearch, {});
  const searchButton = /* @__PURE__ */ jsx(IconButton, { elementType: Link, to: SearchPage.path, children: /* @__PURE__ */ jsx(SearchIcon, {}) });
  const mobileRightChildren = /* @__PURE__ */ jsxs(Fragment, { children: [
    activePage !== SearchPage && searchButton,
    /* @__PURE__ */ jsx(CreateNewButton, { isCompact: true })
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DashboardNavbar,
      {
        rightChildren: isMobileMode && mobileRightChildren,
        menuPosition: "drive-navbar",
        children
      }
    ),
    isMobileMode && /* @__PURE__ */ jsx(FloatingActionList, {})
  ] });
}
function FloatingActionList() {
  const entriesSelected = useDriveStore((s) => s.selectedEntries.size);
  if (!entriesSelected)
    return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed right-0 top-0 z-10 flex h-54 w-full items-center justify-center gap-10 rounded bg-primary px-6 text-on-primary shadow-xl", children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        onClick: () => {
          driveState().selectEntries([]);
        },
        children: /* @__PURE__ */ jsx(CloseIcon, {})
      }
    ),
    /* @__PURE__ */ jsx(Trans, { message: ":count selected", values: { count: entriesSelected } }),
    /* @__PURE__ */ jsx(EntryActionList, { className: "ml-auto" })
  ] });
}
const DriveRouteConfig = [
  {
    path: "/",
    element: /* @__PURE__ */ jsx(AuthRoute, { children: /* @__PURE__ */ jsx(DriveLayout, {}) })
  },
  {
    path: "/folders/:hash",
    element: /* @__PURE__ */ jsx(AuthRoute, { children: /* @__PURE__ */ jsx(DriveLayout, {}) })
  },
  {
    path: "/shares",
    element: /* @__PURE__ */ jsx(AuthRoute, { children: /* @__PURE__ */ jsx(DriveLayout, {}) })
  },
  {
    path: "/recent",
    element: /* @__PURE__ */ jsx(AuthRoute, { children: /* @__PURE__ */ jsx(DriveLayout, {}) })
  },
  {
    path: "/starred",
    element: /* @__PURE__ */ jsx(AuthRoute, { children: /* @__PURE__ */ jsx(DriveLayout, {}) })
  },
  {
    path: "/trash",
    element: /* @__PURE__ */ jsx(AuthRoute, { children: /* @__PURE__ */ jsx(DriveLayout, {}) })
  },
  {
    path: "/search",
    element: /* @__PURE__ */ jsx(AuthRoute, { children: /* @__PURE__ */ jsx(DriveLayout, {}) })
  },
  { path: "s/:hash", element: /* @__PURE__ */ jsx(ShareableLinkPage, {}) },
  { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) }
];
function DriveRoutes() {
  return useRoutes(DriveRouteConfig);
}
export {
  DriveRoutes as default
};
//# sourceMappingURL=drive-routes-5b5fa20b.mjs.map
