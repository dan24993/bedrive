var _a;
import { jsxs, jsx, Fragment as Fragment$1 } from "react/jsx-runtime";
import { Outlet, Link, useLocation, Navigate, useNavigate, useParams, NavLink, useRoutes } from "react-router-dom";
import clsx from "clsx";
import { u as useSettings, C as CustomMenu, T as Trans, a as apiClient, b as useLocalStorage, E as ErrorIcon, s as setInLocalStorage, m as message, c as useIsMobileMediaQuery, d as useNumberFormatter, S as SelectForwardRef, I as Item, e as IconButton, K as KeyboardArrowLeftIcon, f as createSvgIcon, A as ArrowDropDownIcon, g as useDialogContext, D as Dialog, h as DialogHeader, i as DialogBody, F as Form$1, j as Checkbox, B as Button, k as DialogTrigger, l as useTrans, n as TextField, o as SearchIcon, p as opacityAnimation, q as Skeleton, P as ProgressBar, r as StaticPageTitle, t as queryClient, v as toast, w as showHttpErrorToast, x as ConfirmationDialog, y as IllustratedMessage, z as SvgImage, G as DialogFooter, H as onFormQueryError, J as FormTextField, L as CheckIcon, M as CloseIcon, N as Chip, O as FormattedDate, Q as Tooltip, R as LoginIcon, U as getInputFieldClassNames, V as clamp, W as createEventHandler, X as ButtonBase, Y as FormImageSelector, Z as useValueLists, _ as DoneAllIcon, $ as List, a0 as ListItem, a1 as createSvgIconFromTree, a2 as FormSelect, a3 as Section, a4 as MixedText, a5 as FileUploadProvider, a6 as useAppearanceEditorMode, a7 as ProgressCircle, a8 as useNavigate$1, a9 as useBootstrapData, aa as FullPageLoader, ab as LinkStyle, ac as SiteConfigContext, ad as getBootstrapData, ae as ExternalLink, af as MenuTrigger, ag as Menu, ah as FormRadioGroup, ai as FormRadio, aj as DateFormatPresets, ak as prettyBytes, al as useSocialLogin, am as useField, an as Field, ao as useResendVerificationEmail, ap as useUser, aq as useUploadAvatar, ar as useRemoveAvatar, as as openDialog, at as openUploadWindow, au as UploadInputType, av as FileTypeIcon, aw as useProducts, ax as FormattedPrice, ay as useActiveUpload, az as Disk, aA as WarningIcon, aB as KeyboardArrowDownIcon, aC as UnfoldLessIcon, aD as UnfoldMoreIcon, aE as useCustomPage, aF as PageMetaTags, aG as PageStatus, aH as useCollator, aI as loadFonts, aJ as FormattedRelativeTime, aK as closeDialog, aL as AuthRoute, aM as NotFoundPage } from "../server-entry.mjs";
import { D as DashboardLayout, a as DashboardNavbar, b as DashboardSidenav, c as DashboardContent, F as FilterOperator, d as FilterControlType, e as createdAtFilter, u as updatedAtFilter, K as KeyboardArrowRightIcon, f as useBackendFilterUrlParams, I as InputFilterPanel, N as NormalizedModelFilterPanel, g as DateRangeFilterPanel, C as ChipFieldFilterPanel, S as SelectFilterPanel, B as BackendFiltersUrlKey, h as FilterList$1, T as Table, A as AddIcon, i as downloadFileFromUrl, j as FileDownloadIcon, k as Avatar, l as FormDatePicker, m as FormSwitch, n as ChipList, o as usePointerEvents, p as Switch, q as FormChipField, r as droppables, s as useDraggable, t as useDroppable, v as updateRects, w as DeleteIcon, U as USER_MODEL, L as LinkIcon, M as MoreVertIcon, x as ChipField, y as useCurrentDateTime, z as useNormalizedModels, E as FILE_ENTRY_INDEX_FILTERS, G as FilePreviewDialog, H as timestampFilter, J as FormNormalizedModelField, O as ArrowBackIcon, P as FormattedNumber, Q as InfoIcon } from "./Info-127d05d2.mjs";
import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { S as SectionHelper, E as EditIcon, B as Breadcrumb, a as BreadcrumbItem } from "./Edit-48c44acf.mjs";
import React, { useContext, isValidElement, cloneElement, useRef, useId, useState, Fragment, useCallback, useEffect, forwardRef, Suspense, useMemo, Children, memo } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useControlledState } from "@react-stately/utils";
import { FocusScope, useFocusManager, getFocusableTreeWalker } from "@react-aria/focus";
import { useForm, useController, useFormContext, useFieldArray, FormProvider } from "react-hook-form";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import deepMerge from "deepmerge";
import { useGlobalListeners, mergeProps, snapValueToStep, useObjectRef, getScrollParent, useLayoutEffect, isMac } from "@react-aria/utils";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { parseColor } from "@react-stately/color";
import { produce } from "immer";
import { nanoid } from "nanoid";
import { diff } from "deep-object-diff";
import dot from "dot-object";
import memoize from "nano-memoize";
import { useVirtualizer } from "@tanstack/react-virtual";
import slugify from "slugify";
import { u as useCancelSubscription, a as useResumeSubscription } from "./use-resume-subscription-6a4f3492.mjs";
function AdminSidebar({ className, isCompactMode }) {
  const { version } = useSettings();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        className,
        "relative flex flex-col gap-20 overflow-y-auto border-r bg-alt px-12 pb-16 pt-26 text-sm font-medium text-muted"
      ),
      children: [
        /* @__PURE__ */ jsx(
          CustomMenu,
          {
            matchDescendants: (to) => to === "/admin",
            menu: "admin-sidebar",
            orientation: "vertical",
            onlyShowIcons: isCompactMode,
            itemClassName: ({ isActive }) => clsx(
              "block w-full rounded-button py-12 px-16",
              isActive ? "bg-primary/6 text-primary font-semibold" : "hover:bg-hover"
            ),
            gap: "gap-8"
          }
        ),
        !isCompactMode && /* @__PURE__ */ jsx("div", { className: "mt-auto gap-14 px-16 text-xs", children: /* @__PURE__ */ jsx(Trans, { message: "Version: :number", values: { number: version } }) })
      ]
    }
  );
}
function useAdminSetupAlerts() {
  return useQuery({
    queryKey: ["admin-setup-alerts"],
    queryFn: () => fetchAlerts()
  });
}
function fetchAlerts() {
  return apiClient.get(`admin/setup-alerts`).then((response) => response.data);
}
function AdminLayout() {
  return /* @__PURE__ */ jsxs(DashboardLayout, { name: "admin", leftSidenavCanBeCompact: true, children: [
    /* @__PURE__ */ jsx(DashboardNavbar, { size: "sm", menuPosition: "admin-navbar" }),
    /* @__PURE__ */ jsx(DashboardSidenav, { position: "left", size: "sm", children: /* @__PURE__ */ jsx(AdminSidebar, {}) }),
    /* @__PURE__ */ jsx(DashboardContent, { children: /* @__PURE__ */ jsxs("div", { className: "bg dark:bg-alt", children: [
      /* @__PURE__ */ jsx(SetupAlertsList, {}),
      /* @__PURE__ */ jsx(Outlet, {})
    ] }) })
  ] });
}
function SetupAlertsList() {
  const { data } = useAdminSetupAlerts();
  const [dismissValue] = useLocalStorage("admin-setup-alert-dismissed", null);
  const shouldShowAlert = !dismissValue || Date.now() - dismissValue.timestamp > 864e5;
  if (!(data == null ? void 0 : data.alerts.length) || !shouldShowAlert) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed left-0 right-0 top-24 z-10 mx-auto w-max overflow-hidden rounded-panel bg shadow-md", children: /* @__PURE__ */ jsx(SetupAlert, { alert: data.alerts[0] }) });
}
function SetupAlert({ alert }) {
  const description = /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: alert.description } });
  return /* @__PURE__ */ jsx(
    SectionHelper,
    {
      leadingIcon: /* @__PURE__ */ jsx(ErrorIcon, { size: "xs", className: "text-danger" }),
      onClose: () => {
        setInLocalStorage("admin-setup-alert-dismissed", {
          timestamp: Date.now()
        });
      },
      title: alert.title,
      description,
      color: "neutral"
    },
    alert.title
  );
}
const UserDatatableFilters = [
  {
    key: "email_verified_at",
    label: message("Email"),
    description: message("Email verification status"),
    defaultOperator: FilterOperator.ne,
    control: {
      type: FilterControlType.Select,
      defaultValue: "01",
      options: [
        {
          key: "01",
          label: message("is confirmed"),
          value: { value: null, operator: FilterOperator.ne }
        },
        {
          key: "02",
          label: message("is not confirmed"),
          value: { value: null, operator: FilterOperator.eq }
        }
      ]
    }
  },
  createdAtFilter({
    description: message("Date user registered or was created")
  }),
  updatedAtFilter({
    description: message("Date user was last updated")
  }),
  {
    key: "subscriptions",
    label: message("Subscription"),
    description: message("Whether user is subscribed or not"),
    defaultOperator: FilterOperator.eq,
    control: {
      type: FilterControlType.Select,
      defaultValue: "01",
      options: [
        {
          key: "01",
          label: message("is subscribed"),
          value: { value: "*", operator: FilterOperator.has }
        },
        {
          key: "02",
          label: message("is not subscribed"),
          value: { value: "*", operator: FilterOperator.doesntHave }
        }
      ]
    }
  }
];
const DatatableDataQueryKey = (endpoint2, params) => {
  const key = endpoint2.split("/");
  if (params) {
    key.push(params);
  }
  return key;
};
function useDatatableData(endpoint2, params, options, onLoad) {
  return useQuery({
    queryKey: DatatableDataQueryKey(endpoint2, params),
    queryFn: ({ signal }) => paginate(endpoint2, params, onLoad, signal),
    placeholderData: keepPreviousData,
    ...options
  });
}
async function paginate(endpoint2, params, onLoad, signal) {
  if (params.query) {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  const response = await apiClient.get(endpoint2, { params, signal: params.query ? signal : void 0 }).then((response2) => response2.data);
  onLoad == null ? void 0 : onLoad(response);
  return response;
}
const DataTableContext = React.createContext(
  null
);
function useDataTable() {
  return useContext(DataTableContext);
}
function hasNextPage(pagination) {
  if ("next_cursor" in pagination) {
    return pagination.next_cursor != null;
  }
  if ("last_page" in pagination) {
    return pagination.current_page < pagination.last_page;
  }
  return pagination.data.length > 0 && pagination.data.length >= pagination.per_page;
}
const defaultPerPage = 15;
const perPageOptions = [{ key: 10 }, { key: 15 }, { key: 20 }, { key: 50 }, { key: 100 }];
function DataTablePaginationFooter({
  query,
  onPerPageChange,
  onPageChange,
  className
}) {
  var _a2;
  const isMobile = useIsMobileMediaQuery();
  const numberFormatter = useNumberFormatter();
  const pagination = (_a2 = query.data) == null ? void 0 : _a2.pagination;
  if (!pagination)
    return null;
  const perPageSelect = onPerPageChange ? /* @__PURE__ */ jsx(
    SelectForwardRef,
    {
      minWidth: "min-w-auto",
      selectionMode: "single",
      disabled: query.isLoading,
      labelPosition: "side",
      size: "xs",
      label: /* @__PURE__ */ jsx(Trans, { message: "Items per page" }),
      selectedValue: pagination.per_page || defaultPerPage,
      onSelectionChange: (value) => onPerPageChange(value),
      children: perPageOptions.map((option) => /* @__PURE__ */ jsx(Item, { value: option.key, children: option.key }, option.key))
    }
  ) : null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        "flex h-54 select-none items-center justify-end gap-20 px-20",
        className
      ),
      children: [
        !isMobile && perPageSelect,
        pagination.from && pagination.to && "total" in pagination ? /* @__PURE__ */ jsx("div", { className: "text-sm", children: /* @__PURE__ */ jsx(
          Trans,
          {
            message: ":from - :to of :total",
            values: {
              from: pagination.from,
              to: pagination.to,
              total: numberFormatter.format(pagination.total)
            }
          }
        ) }) : null,
        /* @__PURE__ */ jsxs("div", { className: "text-muted", children: [
          /* @__PURE__ */ jsx(
            IconButton,
            {
              disabled: query.isFetching || pagination.current_page < 2,
              onClick: () => {
                onPageChange == null ? void 0 : onPageChange((pagination == null ? void 0 : pagination.current_page) - 1);
              },
              children: /* @__PURE__ */ jsx(KeyboardArrowLeftIcon, {})
            }
          ),
          /* @__PURE__ */ jsx(
            IconButton,
            {
              disabled: query.isFetching || !hasNextPage(pagination),
              onClick: () => {
                onPageChange == null ? void 0 : onPageChange((pagination == null ? void 0 : pagination.current_page) + 1);
              },
              children: /* @__PURE__ */ jsx(KeyboardArrowRightIcon, {})
            }
          )
        ] })
      ]
    }
  );
}
const FilterAltIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M7 6h10l-5.01 6.3L7 6zm-2.75-.39C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61z" }),
  "FilterAltOutlined"
);
const AccordionAnimation = {
  variants: {
    open: {
      height: "auto",
      visibility: "visible",
      transitionEnd: {
        overflow: "auto"
      }
    },
    closed: {
      height: 0,
      overflow: "hidden",
      transitionEnd: {
        visibility: "hidden"
      }
    }
  },
  transition: { type: "tween", duration: 0.2 }
};
const Accordion = React.forwardRef(
  ({
    variant = "default",
    mode = "single",
    children,
    className,
    isLazy,
    ...other
  }, ref) => {
    const [expandedValues, setExpandedValues] = useControlledState(
      other.expandedValues,
      other.defaultExpandedValues || [],
      other.onExpandedChange
    );
    const itemsCount = React.Children.count(children);
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: clsx(variant === "outline" && "space-y-10", className),
        ref,
        role: "presentation",
        children: /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsx(FocusScope, { children: React.Children.map(children, (child, index) => {
          if (!isValidElement(child))
            return null;
          return cloneElement(child, {
            key: child.key || index,
            value: child.props.value || index,
            isFirst: index === 0,
            isLast: index === itemsCount - 1,
            mode,
            variant,
            expandedValues,
            setExpandedValues,
            isLazy
          });
        }) }) })
      }
    );
  }
);
function AccordionItem(props) {
  const {
    children,
    label,
    disabled,
    bodyClassName,
    labelClassName,
    buttonPadding = "py-10 pl-14 pr-10",
    startIcon,
    description,
    endAppend,
    chevronPosition = "right",
    isFirst,
    mode,
    isLazy,
    variant,
    footerContent,
    onHeaderMouseEnter,
    onHeaderMouseLeave
  } = props;
  const expandedValues = props.expandedValues || [];
  const value = props.value || 0;
  const setExpandedValues = props.setExpandedValues || (() => {
  });
  const ref = useRef(null);
  const isExpanded = !disabled && expandedValues.includes(value);
  const wasExpandedOnce = useRef(false);
  if (isExpanded) {
    wasExpandedOnce.current = true;
  }
  const focusManager = useFocusManager();
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;
  const onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        focusManager == null ? void 0 : focusManager.focusNext();
        break;
      case "ArrowUp":
        focusManager == null ? void 0 : focusManager.focusPrevious();
        break;
      case "Home":
        focusManager == null ? void 0 : focusManager.focusFirst();
        break;
      case "End":
        focusManager == null ? void 0 : focusManager.focusLast();
        break;
    }
  };
  const toggle = () => {
    const i = expandedValues.indexOf(value);
    if (i > -1) {
      const newKeys = [...expandedValues];
      newKeys.splice(i, 1);
      setExpandedValues(newKeys);
    } else if (mode === "single") {
      setExpandedValues([value]);
    } else {
      setExpandedValues([...expandedValues, value]);
    }
  };
  const chevron = /* @__PURE__ */ jsx("div", { className: clsx(variant === "minimal" && ""), children: /* @__PURE__ */ jsx(
    ArrowDropDownIcon,
    {
      "aria-hidden": "true",
      size: "md",
      className: clsx(
        disabled ? "text-disabled" : "text-muted",
        isExpanded && "rotate-180 transition-transform"
      )
    }
  ) });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        variant === "default" && "border-b",
        variant === "outline" && "rounded-panel border",
        disabled && "text-disabled"
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "h3",
          {
            className: clsx(
              "flex w-full items-center justify-between text-sm",
              disabled && "pointer-events-none",
              isFirst && variant === "default" && "border-t",
              isExpanded && variant !== "minimal" ? "border-b" : "border-b border-b-transparent",
              variant === "outline" ? isExpanded ? "rounded-panel-t" : "rounded-panel" : void 0
            ),
            onMouseEnter: onHeaderMouseEnter,
            onMouseLeave: onHeaderMouseLeave,
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  disabled,
                  "aria-expanded": isExpanded,
                  id: buttonId,
                  "aria-controls": panelId,
                  type: "button",
                  ref,
                  onKeyDown,
                  onClick: () => {
                    if (!disabled) {
                      toggle();
                    }
                  },
                  className: clsx(
                    "flex flex-auto items-center gap-10 text-left outline-none hover:bg-hover focus-visible:bg-primary/focus",
                    buttonPadding
                  ),
                  children: [
                    chevronPosition === "left" && chevron,
                    startIcon && cloneElement(startIcon, {
                      size: "md",
                      className: clsx(
                        startIcon.props.className,
                        disabled ? "text-disabled" : "text-muted"
                      )
                    }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-auto overflow-hidden overflow-ellipsis", children: [
                      /* @__PURE__ */ jsx("div", { className: labelClassName, "data-testid": "accordion-label", children: label }),
                      description && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted", children: description })
                    ] }),
                    chevronPosition === "right" && chevron
                  ]
                }
              ),
              endAppend && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 px-4 text-sm text-muted", children: endAppend })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          m.div,
          {
            "aria-labelledby": id,
            role: "region",
            variants: AccordionAnimation.variants,
            transition: AccordionAnimation.transition,
            initial: false,
            animate: isExpanded ? "open" : "closed",
            children: [
              /* @__PURE__ */ jsx("div", { className: clsx("p-16", bodyClassName), children: !isLazy || wasExpandedOnce ? children : null }),
              footerContent
            ]
          }
        )
      ]
    }
  );
}
function BooleanFilterPanel({
  filter
}) {
  return null;
}
function AddFilterDialog({ filters }) {
  const { decodedFilters } = useBackendFilterUrlParams(filters);
  const { formId } = useDialogContext();
  const [expandedFilters, setExpandedFilters] = useState(
    () => {
      return decodedFilters.map((f) => f.key);
    }
  );
  const clearButton = /* @__PURE__ */ jsx(
    Button,
    {
      size: "xs",
      variant: "outline",
      className: "mr-auto",
      onClick: () => {
        setExpandedFilters([]);
      },
      children: /* @__PURE__ */ jsx(Trans, { message: "Clear" })
    }
  );
  const applyButton = /* @__PURE__ */ jsx(
    Button,
    {
      size: "xs",
      variant: "flat",
      color: "primary",
      className: "ml-auto",
      type: "submit",
      form: formId,
      children: /* @__PURE__ */ jsx(Trans, { message: "Apply" })
    }
  );
  return /* @__PURE__ */ jsxs(Dialog, { className: "min-w-[300px]", maxWidth: "max-w-400", size: "auto", children: [
    /* @__PURE__ */ jsx(
      DialogHeader,
      {
        padding: "px-14 py-10",
        leftAdornment: clearButton,
        rightAdornment: applyButton,
        children: /* @__PURE__ */ jsx(Trans, { message: "Filter" })
      }
    ),
    /* @__PURE__ */ jsx(DialogBody, { padding: "p-0", children: /* @__PURE__ */ jsx(
      FilterList,
      {
        filters,
        expandedFilters,
        setExpandedFilters
      }
    ) })
  ] });
}
function FilterList({
  filters,
  expandedFilters,
  setExpandedFilters
}) {
  const { decodedFilters, replaceAll } = useBackendFilterUrlParams(filters);
  const defaultValues = {};
  filters.forEach((filter) => {
    const appliedFilter = decodedFilters.find((f) => f.key === filter.key);
    defaultValues[filter.key] = (appliedFilter == null ? void 0 : appliedFilter.value) !== void 0 ? (
      // there might be some extra keys set on filter besides
      // "value" and "operator", so add the whole object to form
      appliedFilter
    ) : {
      value: filter.control.defaultValue,
      operator: filter.defaultOperator
    };
  });
  const form = useForm({ defaultValues });
  const { formId, close } = useDialogContext();
  return /* @__PURE__ */ jsx(
    Form$1,
    {
      form,
      id: formId,
      onSubmit: (formValue) => {
        const filterValue = Object.entries(formValue).filter(
          ([key, fieldValue]) => expandedFilters.includes(key) && fieldValue !== void 0
        ).map(([key, fieldValue]) => ({
          key,
          ...fieldValue
          // value and operator from form
        }));
        replaceAll(filterValue);
        close();
      },
      children: /* @__PURE__ */ jsx(
        Accordion,
        {
          mode: "multiple",
          expandedValues: expandedFilters,
          onExpandedChange: setExpandedFilters,
          children: filters.map((filter) => /* @__PURE__ */ jsxs(
            AccordionItem,
            {
              startIcon: /* @__PURE__ */ jsx(Checkbox, { checked: expandedFilters.includes(filter.key) }),
              value: filter.key,
              label: /* @__PURE__ */ jsx(Trans, { ...filter.label }),
              bodyClassName: "max-h-288 overflow-y-auto compact-scrollbar",
              children: [
                filter.description && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: clsx(
                      "text-xs text-muted",
                      // boolean filter will have nothing in the panel, no need to add margin
                      filter.control.type !== FilterControlType.BooleanToggle && "mb-14"
                    ),
                    children: /* @__PURE__ */ jsx(Trans, { ...filter.description })
                  }
                ),
                /* @__PURE__ */ jsx(AddFilterDialogPanel, { filter })
              ]
            },
            filter.key
          ))
        }
      )
    }
  );
}
function AddFilterDialogPanel({ filter }) {
  switch (filter.control.type) {
    case FilterControlType.Select:
      return /* @__PURE__ */ jsx(
        SelectFilterPanel,
        {
          filter
        }
      );
    case FilterControlType.ChipField:
      return /* @__PURE__ */ jsx(
        ChipFieldFilterPanel,
        {
          filter
        }
      );
    case FilterControlType.DateRangePicker:
      return /* @__PURE__ */ jsx(
        DateRangeFilterPanel,
        {
          filter
        }
      );
    case FilterControlType.SelectModel:
      return /* @__PURE__ */ jsx(
        NormalizedModelFilterPanel,
        {
          filter
        }
      );
    case FilterControlType.Input:
      return /* @__PURE__ */ jsx(
        InputFilterPanel,
        {
          filter
        }
      );
    case FilterControlType.BooleanToggle:
      return /* @__PURE__ */ jsx(
        BooleanFilterPanel,
        {
          filter
        }
      );
    case "custom":
      const CustomComponent = filter.control.panel;
      return /* @__PURE__ */ jsx(
        CustomComponent,
        {
          filter
        }
      );
    default:
      return null;
  }
}
function AddFilterButton({
  filters,
  icon = /* @__PURE__ */ jsx(FilterAltIcon, {}),
  color = "primary",
  variant = "outline",
  size = "sm",
  disabled,
  className
}) {
  const isMobile = useIsMobileMediaQuery();
  const desktopButton = /* @__PURE__ */ jsx(
    Button,
    {
      variant,
      color,
      startIcon: icon,
      disabled,
      size,
      className,
      children: /* @__PURE__ */ jsx(Trans, { message: "Filter" })
    }
  );
  const mobileButton = /* @__PURE__ */ jsx(
    IconButton,
    {
      color,
      size: "sm",
      variant,
      disabled,
      className,
      children: icon
    }
  );
  return /* @__PURE__ */ jsxs(DialogTrigger, { type: "popover", children: [
    isMobile ? mobileButton : desktopButton,
    /* @__PURE__ */ jsx(AddFilterDialog, { filters })
  ] });
}
function DataTableHeader({
  actions,
  filters,
  filtersLoading,
  searchPlaceholder = message("Type to search..."),
  searchValue = "",
  onSearchChange
}) {
  const { trans } = useTrans();
  return /* @__PURE__ */ jsxs(HeaderLayout, { children: [
    /* @__PURE__ */ jsx(
      TextField,
      {
        size: "sm",
        className: "mr-auto min-w-180 max-w-440 flex-auto",
        inputWrapperClassName: "mr-24 md:mr-0",
        placeholder: trans(searchPlaceholder),
        startAdornment: /* @__PURE__ */ jsx(SearchIcon, { size: "sm" }),
        value: searchValue,
        onChange: (e) => {
          onSearchChange(e.target.value);
        }
      }
    ),
    filters && /* @__PURE__ */ jsx(AddFilterButton, { filters, disabled: filtersLoading }),
    actions
  ] });
}
function HeaderLayout({ children, ...domProps }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "hidden-scrollbar relative mb-24 flex h-42 items-center gap-8 overflow-x-auto text-muted md:gap-12",
      ...domProps,
      children
    }
  );
}
function SelectedStateDatatableHeader({
  actions,
  selectedItemsCount
}) {
  return /* @__PURE__ */ jsxs(HeaderLayout, { "data-testid": "datatable-selected-header", children: [
    /* @__PURE__ */ jsx("div", { className: "mr-auto", children: /* @__PURE__ */ jsx(
      Trans,
      {
        message: "[one 1 item|other :count items] selected",
        values: { count: selectedItemsCount }
      }
    ) }),
    actions
  ] });
}
function FilterListSkeleton() {
  return /* @__PURE__ */ jsxs(
    m.div,
    {
      className: "flex items-center gap-6 h-30",
      ...opacityAnimation,
      children: [
        /* @__PURE__ */ jsx(Skeleton, { variant: "rect", size: "h-full w-144", radius: "rounded-md" }),
        /* @__PURE__ */ jsx(Skeleton, { variant: "rect", size: "h-full w-112", radius: "rounded-md" }),
        /* @__PURE__ */ jsx(Skeleton, { variant: "rect", size: "h-full w-172", radius: "rounded-md" })
      ]
    },
    "filter-list-skeleton"
  );
}
function DataTable({
  filters,
  filtersLoading,
  columns,
  searchPlaceholder,
  queryParams,
  endpoint: endpoint2,
  actions,
  selectedActions,
  emptyStateMessage,
  tableDomProps,
  onRowAction,
  enableSelection = true,
  selectionStyle = "checkbox",
  children,
  cellHeight,
  collapseTableOnMobile = true
}) {
  var _a2;
  const isMobile = useIsMobileMediaQuery();
  const { trans } = useTrans();
  const { encodedFilters } = useBackendFilterUrlParams(filters);
  const [params, setParams] = useState({ perPage: 15 });
  const [selectedRows, setSelectedRows] = useState([]);
  const query = useDatatableData(
    endpoint2,
    {
      ...params,
      ...queryParams,
      [BackendFiltersUrlKey]: encodedFilters
    },
    void 0,
    () => setSelectedRows([])
  );
  const isFiltering = !!(params.query || params.filters || encodedFilters);
  const pagination = (_a2 = query.data) == null ? void 0 : _a2.pagination;
  return /* @__PURE__ */ jsxs(
    DataTableContext.Provider,
    {
      value: {
        selectedRows,
        setSelectedRows,
        endpoint: endpoint2,
        params,
        setParams,
        query
      },
      children: [
        children,
        /* @__PURE__ */ jsx(AnimatePresence, { initial: false, mode: "wait", children: selectedRows.length ? /* @__PURE__ */ jsx(
          SelectedStateDatatableHeader,
          {
            selectedItemsCount: selectedRows.length,
            actions: selectedActions
          },
          "selected"
        ) : /* @__PURE__ */ jsx(
          DataTableHeader,
          {
            searchPlaceholder,
            searchValue: params.query,
            onSearchChange: (query2) => setParams({ ...params, query: query2 }),
            actions,
            filters,
            filtersLoading
          },
          "default"
        ) }),
        filters && /* @__PURE__ */ jsx("div", { className: "mb-14", children: /* @__PURE__ */ jsx(AnimatePresence, { initial: false, mode: "wait", children: filtersLoading && encodedFilters ? /* @__PURE__ */ jsx(FilterListSkeleton, {}) : /* @__PURE__ */ jsx(m.div, { ...opacityAnimation, children: /* @__PURE__ */ jsx(FilterList$1, { filters }) }, "filter-list") }) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: clsx(
              "relative rounded-panel",
              (!isMobile || !collapseTableOnMobile) && "border"
            ),
            children: [
              query.isFetching && /* @__PURE__ */ jsx(
                ProgressBar,
                {
                  isIndeterminate: true,
                  className: "absolute left-0 top-0 z-10 w-full",
                  "aria-label": trans({ message: "Loading" }),
                  size: "xs"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "relative overflow-x-auto md:overflow-hidden", children: /* @__PURE__ */ jsx(
                Table,
                {
                  ...tableDomProps,
                  columns,
                  data: (pagination == null ? void 0 : pagination.data) || [],
                  sortDescriptor: params,
                  onSortChange: (descriptor) => {
                    setParams({ ...params, ...descriptor });
                  },
                  selectedRows,
                  enableSelection,
                  selectionStyle,
                  onSelectionChange: setSelectedRows,
                  onAction: onRowAction,
                  collapseOnMobile: collapseTableOnMobile,
                  cellHeight
                }
              ) }),
              (query.isFetched || query.isPlaceholderData) && !(pagination == null ? void 0 : pagination.data.length) ? /* @__PURE__ */ jsx("div", { className: "pt-50", children: cloneElement(emptyStateMessage, {
                isFiltering
              }) }) : void 0,
              /* @__PURE__ */ jsx(
                DataTablePaginationFooter,
                {
                  query,
                  onPageChange: (page) => setParams({ ...params, page }),
                  onPerPageChange: (perPage) => setParams({ ...params, perPage })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function DataTablePage({
  title,
  headerContent,
  headerItemsAlign = "items-end",
  className,
  padding,
  ...dataTableProps
}) {
  const titleId = useId();
  return /* @__PURE__ */ jsxs("div", { className: clsx(padding ?? "p-12 md:p-24", className), children: [
    title && /* @__PURE__ */ jsxs(
      "div",
      {
        className: clsx(
          "mb-16",
          headerContent && `flex ${headerItemsAlign} gap-4`
        ),
        children: [
          /* @__PURE__ */ jsx(StaticPageTitle, { children: title }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-light first:capitalize", id: titleId, children: title }),
          headerContent
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      DataTable,
      {
        ...dataTableProps,
        tableDomProps: {
          "aria-labelledby": title ? titleId : void 0
        }
      }
    )
  ] });
}
function useDeleteSelectedRows() {
  const { endpoint: endpoint2, selectedRows, setSelectedRows } = useDataTable();
  return useMutation({
    mutationFn: () => deleteSelectedRows(endpoint2, selectedRows),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey(endpoint2)
      });
      toast(
        message("Deleted [one 1 record|other :count records]", {
          values: { count: selectedRows.length }
        })
      );
      setSelectedRows([]);
    },
    onError: (err) => showHttpErrorToast(err, message("Could not delete records"))
  });
}
function deleteSelectedRows(endpoint2, ids) {
  return apiClient.delete(`${endpoint2}/${ids.join(",")}`).then((r) => r.data);
}
function DeleteSelectedItemsAction() {
  return /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
    /* @__PURE__ */ jsx(Button, { variant: "flat", color: "danger", className: "ml-auto", children: /* @__PURE__ */ jsx(Trans, { message: "Delete" }) }),
    /* @__PURE__ */ jsx(DeleteItemsDialog, {})
  ] });
}
function DeleteItemsDialog() {
  const deleteSelectedRows2 = useDeleteSelectedRows();
  const { selectedRows } = useDataTable();
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsx(
    ConfirmationDialog,
    {
      isLoading: deleteSelectedRows2.isPending,
      title: /* @__PURE__ */ jsx(
        Trans,
        {
          message: "Delete [one 1 item|other :count items]?",
          values: { count: selectedRows.length }
        }
      ),
      body: /* @__PURE__ */ jsx(Trans, { message: "This will permanently remove the items and cannot be undone." }),
      confirm: /* @__PURE__ */ jsx(Trans, { message: "Delete" }),
      isDanger: true,
      onConfirm: () => {
        deleteSelectedRows2.mutate(void 0, { onSuccess: () => close() });
      }
    }
  );
}
function DataTableEmptyStateMessage({
  isFiltering,
  title,
  filteringTitle,
  image,
  size,
  className
}) {
  const isMobile = useIsMobileMediaQuery();
  if (!size) {
    size = isMobile ? "sm" : "md";
  }
  return /* @__PURE__ */ jsx(
    IllustratedMessage,
    {
      className,
      size,
      image: /* @__PURE__ */ jsx(SvgImage, { src: image }),
      title: isFiltering && filteringTitle ? filteringTitle : title,
      description: isFiltering && filteringTitle ? /* @__PURE__ */ jsx(Trans, { message: "Try another search query or different filters" }) : void 0
    }
  );
}
const teamSvg = "/assets/team-de984127.svg";
const DataTableAddItemButton = React.forwardRef(
  ({ children, to, elementType, onClick, href, download, icon, disabled }, ref) => {
    const isMobile = useIsMobileMediaQuery();
    if (isMobile) {
      return /* @__PURE__ */ jsx(
        IconButton,
        {
          ref,
          variant: "flat",
          color: "primary",
          className: "flex-shrink-0",
          size: "sm",
          to,
          href,
          download,
          elementType,
          onClick,
          disabled,
          children: icon || /* @__PURE__ */ jsx(AddIcon, {})
        }
      );
    }
    return /* @__PURE__ */ jsx(
      Button,
      {
        ref,
        startIcon: icon || /* @__PURE__ */ jsx(AddIcon, {}),
        variant: "flat",
        color: "primary",
        size: "sm",
        to,
        href,
        download,
        elementType,
        onClick,
        disabled,
        children
      }
    );
  }
);
function useExportCsv(endpoint2) {
  return useMutation({
    mutationFn: (payload) => exportCsv(endpoint2, payload),
    onError: (err) => showHttpErrorToast(err)
  });
}
function exportCsv(endpoint2, payload) {
  return apiClient.post(endpoint2, payload).then((r) => r.data);
}
function CsvExportInfoDialog() {
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Csv export" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      Trans,
      {
        message: "Your request is being processed. We'll email you when the report is ready to download. In\n            certain cases, it might take a little longer, depending on the number of items beings\n            exported and the volume of activity."
      }
    ) }),
    /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(Button, { variant: "flat", color: "primary", onClick: close, children: /* @__PURE__ */ jsx(Trans, { message: "Got it" }) }) })
  ] });
}
function DataTableExportCsvButton({
  endpoint: endpoint2,
  payload
}) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const exportCsv2 = useExportCsv(endpoint2);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        variant: "outline",
        color: "primary",
        size: "sm",
        className: "flex-shrink-0",
        disabled: exportCsv2.isPending,
        onClick: () => {
          exportCsv2.mutate(payload, {
            onSuccess: (response) => {
              if (response.downloadPath) {
                downloadFileFromUrl(response.downloadPath);
              } else {
                setDialogIsOpen(true);
              }
            }
          });
        },
        children: /* @__PURE__ */ jsx(FileDownloadIcon, {})
      }
    ),
    /* @__PURE__ */ jsx(
      DialogTrigger,
      {
        type: "modal",
        isOpen: dialogIsOpen,
        onOpenChange: setDialogIsOpen,
        children: /* @__PURE__ */ jsx(CsvExportInfoDialog, {})
      }
    )
  ] });
}
function NameWithAvatar({
  image,
  label,
  description,
  labelClassName,
  avatarSize = "md"
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12", children: [
    image && /* @__PURE__ */ jsx(Avatar, { size: avatarSize, className: "flex-shrink-0", src: image }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0 overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: clsx(labelClassName, "overflow-hidden overflow-ellipsis"),
          children: label
        }
      ),
      description && /* @__PURE__ */ jsx("div", { className: "overflow-hidden overflow-ellipsis text-xs text-muted", children: description })
    ] })
  ] });
}
const PersonOffIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "m20 17.17-3.37-3.38c.64.22 1.23.48 1.77.76.97.51 1.58 1.52 1.6 2.62zm1.19 4.02-1.41 1.41-2.61-2.6H4v-2.78c0-1.12.61-2.15 1.61-2.66 1.29-.66 2.87-1.22 4.67-1.45L1.39 4.22 2.8 2.81l18.39 18.38zM15.17 18l-3-3H12c-2.37 0-4.29.73-5.48 1.34-.32.16-.52.5-.52.88V18h9.17zM12 6c1.1 0 2 .9 2 2 0 .86-.54 1.59-1.3 1.87l1.48 1.48C15.28 10.64 16 9.4 16 8c0-2.21-1.79-4-4-4-1.4 0-2.64.72-3.35 1.82l1.48 1.48C10.41 6.54 11.14 6 12 6z" }),
  "PersonOffOutlined"
);
function useBanUser(form, userId) {
  return useMutation({
    mutationFn: (payload) => banUser(userId, payload),
    onSuccess: async () => {
      toast(message("User suspended"));
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (r) => onFormQueryError(r, form)
  });
}
function banUser(userId, payload) {
  return apiClient.post(`users/${userId}/ban`, payload).then((r) => r.data);
}
function BanUserDialog({ user }) {
  const { trans } = useTrans();
  const { close, formId } = useDialogContext();
  const form = useForm({
    defaultValues: {
      permanent: true
    }
  });
  const isPermanent = form.watch("permanent");
  const banUser2 = useBanUser(form, user.id);
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Suspend “:name“", values: { name: user.display_name } }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsxs(
      Form$1,
      {
        id: formId,
        form,
        onSubmit: (values) => banUser2.mutate(values, { onSuccess: () => close() }),
        children: [
          /* @__PURE__ */ jsx(
            FormDatePicker,
            {
              name: "ban_until",
              label: /* @__PURE__ */ jsx(Trans, { message: "Suspend until" }),
              disabled: isPermanent
            }
          ),
          /* @__PURE__ */ jsx(FormSwitch, { name: "permanent", className: "mt-12", children: /* @__PURE__ */ jsx(Trans, { message: "Permanent" }) }),
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              className: "mt-24",
              name: "comment",
              inputElementType: "textarea",
              maxLength: 250,
              label: /* @__PURE__ */ jsx(Trans, { message: "Reason" }),
              placeholder: trans(message("Optional"))
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: () => close(), children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          form: formId,
          variant: "flat",
          color: "primary",
          type: "submit",
          disabled: banUser2.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Suspend" })
        }
      )
    ] })
  ] });
}
function useUnbanUser(userId) {
  return useMutation({
    mutationFn: () => unbanUser(userId),
    onSuccess: () => {
      toast(message("User unsuspended"));
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (r) => showHttpErrorToast(r)
  });
}
function unbanUser(userId) {
  return apiClient.delete(`users/${userId}/unban`).then((r) => r.data);
}
function useImpersonateUser() {
  return useMutation({
    mutationFn: (payload) => impersonateUser(payload),
    onSuccess: async (response) => {
      toast(message(`Impersonating User "${response.user.display_name}"`));
      window.location.href = "/";
    },
    onError: (r) => showHttpErrorToast(r)
  });
}
function impersonateUser(payload) {
  return apiClient.post(`admin/users/impersonate/${payload.userId}`, payload).then((r) => r.data);
}
const userDatatableColumns = [
  {
    key: "name",
    allowsSorting: true,
    sortingKey: "email",
    width: "flex-3 min-w-200",
    visibleInMode: "all",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "User" }),
    body: (user) => /* @__PURE__ */ jsx(
      NameWithAvatar,
      {
        image: user.avatar,
        label: user.display_name,
        description: user.email
      }
    )
  },
  {
    key: "subscribed",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Subscribed" }),
    width: "w-96",
    body: (user) => {
      var _a2;
      return ((_a2 = user.subscriptions) == null ? void 0 : _a2.length) ? /* @__PURE__ */ jsx(CheckIcon, { className: "text-positive icon-md" }) : /* @__PURE__ */ jsx(CloseIcon, { className: "text-danger icon-md" });
    }
  },
  {
    key: "roles",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Roles" }),
    body: (user) => {
      var _a2;
      return /* @__PURE__ */ jsx(ChipList, { radius: "rounded", size: "xs", children: (_a2 = user == null ? void 0 : user.roles) == null ? void 0 : _a2.map((role) => /* @__PURE__ */ jsx(Chip, { selectable: true, children: /* @__PURE__ */ jsx(
        Link,
        {
          className: clsx("capitalize"),
          target: "_blank",
          to: `/admin/roles/${role.id}/edit`,
          children: /* @__PURE__ */ jsx(Trans, { message: role.name })
        }
      ) }, role.id)) });
    }
  },
  {
    key: "firstName",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "First name" }),
    body: (user) => user.first_name
  },
  {
    key: "lastName",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Last name" }),
    body: (user) => user.last_name
  },
  {
    key: "createdAt",
    allowsSorting: true,
    width: "w-96",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Created at" }),
    body: (user) => /* @__PURE__ */ jsx("time", { children: /* @__PURE__ */ jsx(FormattedDate, { date: user.created_at }) })
  },
  {
    key: "actions",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    width: "w-128 flex-shrink-0",
    hideHeader: true,
    align: "end",
    visibleInMode: "all",
    body: (user) => /* @__PURE__ */ jsxs("div", { className: "text-muted", children: [
      /* @__PURE__ */ jsx(Link, { to: `${user.id}/edit`, children: /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Edit user" }), children: /* @__PURE__ */ jsx(IconButton, { size: "md", children: /* @__PURE__ */ jsx(EditIcon, {}) }) }) }),
      user.banned_at ? /* @__PURE__ */ jsx(UnbanButton, { user }) : /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
        /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Suspend user" }), children: /* @__PURE__ */ jsx(IconButton, { size: "md", children: /* @__PURE__ */ jsx(PersonOffIcon, {}) }) }),
        /* @__PURE__ */ jsx(BanUserDialog, { user })
      ] }),
      /* @__PURE__ */ jsx(ImpersonateButton, { user })
    ] })
  }
];
function UnbanButton({ user }) {
  const unban = useUnbanUser(user.id);
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (confirmed) => {
        if (confirmed) {
          unban.mutate();
        }
      },
      children: [
        /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Remove suspension" }), children: /* @__PURE__ */ jsx(IconButton, { size: "md", color: "danger", children: /* @__PURE__ */ jsx(PersonOffIcon, {}) }) }),
        /* @__PURE__ */ jsx(
          ConfirmationDialog,
          {
            isDanger: true,
            title: /* @__PURE__ */ jsx(Trans, { message: "Suspend “:name“", values: { name: user.display_name } }),
            body: /* @__PURE__ */ jsx(Trans, { message: "Are you sure you want to remove suspension from this user?" }),
            confirm: /* @__PURE__ */ jsx(Trans, { message: "Unsuspend" })
          }
        )
      ]
    }
  );
}
function ImpersonateButton({ user }) {
  const impersonate = useImpersonateUser();
  return /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Login as user" }), children: /* @__PURE__ */ jsx(IconButton, { size: "md", children: /* @__PURE__ */ jsx(LoginIcon, {}) }) }),
    /* @__PURE__ */ jsx(
      ConfirmationDialog,
      {
        title: /* @__PURE__ */ jsx(
          Trans,
          {
            message: "Login as “:name“",
            values: { name: user.display_name }
          }
        ),
        isLoading: impersonate.isPending,
        body: /* @__PURE__ */ jsx(Trans, { message: "Are you sure you want to login as this user?" }),
        confirm: /* @__PURE__ */ jsx(Trans, { message: "Login" }),
        onConfirm: () => {
          impersonate.mutate({ userId: user.id });
        }
      }
    )
  ] });
}
function UserDatatable() {
  const { billing } = useSettings();
  const filteredColumns = !billing.enable ? userDatatableColumns.filter((c) => c.key !== "subscribed") : userDatatableColumns;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    DataTablePage,
    {
      endpoint: "users",
      title: /* @__PURE__ */ jsx(Trans, { message: "Users" }),
      filters: UserDatatableFilters,
      columns: filteredColumns,
      actions: /* @__PURE__ */ jsx(Actions$8, {}),
      queryParams: { with: "subscriptions,bans" },
      selectedActions: /* @__PURE__ */ jsx(DeleteSelectedItemsAction, {}),
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: teamSvg,
          title: /* @__PURE__ */ jsx(Trans, { message: "No users have been created yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching users" })
        }
      )
    }
  ) });
}
function Actions$8() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DataTableExportCsvButton, { endpoint: "users/csv/export" }),
    /* @__PURE__ */ jsx(DataTableAddItemButton, { elementType: Link, to: "new", children: /* @__PURE__ */ jsx(Trans, { message: "Add new user" }) })
  ] });
}
function chunkArray(array, chunkSize) {
  return array.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
}
const DefaultAppearanceConfig = {
  preview: {
    defaultRoute: "/",
    navigationRoutes: []
  },
  sections: {
    general: {
      label: message("General"),
      position: 1,
      buildBreadcrumb: () => [
        {
          label: message("General"),
          location: `general`
        }
      ]
    },
    themes: {
      label: message("Themes"),
      position: 2,
      buildBreadcrumb: (pathname, formValue) => {
        var _a2;
        const parts = pathname.split("/").filter((p) => !!p);
        const [, , , themeIndex] = parts;
        const breadcrumb = [
          {
            label: message("Themes"),
            location: `themes`
          }
        ];
        if (themeIndex != null) {
          breadcrumb.push({
            label: (_a2 = formValue.appearance.themes.all[+themeIndex]) == null ? void 0 : _a2.name,
            location: `themes/${themeIndex}`
          });
        }
        if (parts.at(-1) === "font") {
          breadcrumb.push({
            label: message("Font"),
            location: `themes/${themeIndex}/font`
          });
        }
        if (parts.at(-1) === "radius") {
          breadcrumb.push({
            label: message("Rounding"),
            location: `themes/${themeIndex}/radius`
          });
        }
        return breadcrumb;
      }
    },
    menus: {
      label: message("Menus"),
      position: 3,
      buildBreadcrumb: (pathname, formValue) => {
        const parts = pathname.split("/").filter((p) => !!p);
        const [, , ...rest] = parts;
        const breadcrumb = [
          {
            label: message("Menus"),
            location: "menus"
          }
        ];
        const chunked = chunkArray(rest, 2);
        chunked.forEach(([sectionName, sectionIndex], chunkIndex) => {
          var _a2, _b;
          if (sectionName === "menus" && sectionIndex != null) {
            breadcrumb.push({
              label: (_a2 = formValue.settings.menus[+sectionIndex]) == null ? void 0 : _a2.name,
              location: `menus/${sectionIndex}`
            });
          } else if (sectionName === "items" && sectionIndex != null) {
            const [, menuIndex] = chunked[chunkIndex - 1];
            breadcrumb.push({
              label: (_b = formValue.settings.menus[+menuIndex].items[+sectionIndex]) == null ? void 0 : _b.label,
              location: `menus/${menuIndex}/${sectionIndex}`
            });
          }
        });
        return breadcrumb;
      },
      config: {
        availableRoutes: [
          "/",
          "/login",
          "/register",
          "/contact",
          "/pricing",
          "/account-settings",
          "/admin",
          "/admin/appearance",
          "/admin/settings",
          "/admin/plans",
          "/admin/subscriptions",
          "/admin/users",
          "/admin/roles",
          "/admin/pages",
          "/admin/tags",
          "/admin/files",
          "/admin/localizations",
          "/admin/ads",
          "/admin/settings/authentication",
          "/admin/settings/branding",
          "/admin/settings/cache",
          "/admin/settings/providers",
          "/api-docs"
        ],
        positions: [
          "admin-navbar",
          "admin-sidebar",
          "custom-page-navbar",
          "auth-page-footer",
          "auth-dropdown",
          "account-settings-page",
          "billing-page",
          "checkout-page-navbar",
          "checkout-page-footer",
          "pricing-table-page",
          "contact-us-page",
          "notifications-page",
          "footer",
          "footer-secondary"
        ]
      }
    },
    "custom-code": {
      label: message("Custom Code"),
      position: 4,
      buildBreadcrumb: () => [
        {
          label: message("Custom code"),
          location: `custom-code`
        }
      ]
    },
    "seo-settings": {
      label: message("SEO Settings"),
      position: 5,
      buildBreadcrumb: () => [
        {
          label: message("SEO"),
          location: `seo`
        }
      ]
    }
  }
};
function BaseSlider(props) {
  const {
    size = "md",
    inline,
    label,
    showValueLabel = !!label,
    className,
    width = "w-full",
    slider,
    children,
    trackColor = "primary",
    fillColor = "primary"
  } = props;
  const {
    domProps,
    trackRef,
    getThumbPercent,
    getThumbValueLabel,
    labelId,
    groupId,
    thumbIds,
    isDisabled,
    numberFormatter,
    minValue,
    maxValue,
    step,
    values,
    getValueLabel
  } = slider;
  let outputValue = "";
  let maxLabelLength = Math.max(
    [...numberFormatter.format(minValue)].length,
    [...numberFormatter.format(maxValue)].length,
    [...numberFormatter.format(step)].length
  );
  if (getValueLabel) {
    outputValue = getValueLabel(values[0]);
  } else if (values.length === 1) {
    outputValue = getThumbValueLabel(0);
  } else if (values.length === 2) {
    outputValue = `${getThumbValueLabel(0)} – ${getThumbValueLabel(1)}`;
    maxLabelLength = 3 + 2 * Math.max(
      maxLabelLength,
      [...numberFormatter.format(minValue)].length,
      [...numberFormatter.format(maxValue)].length
    );
  }
  const style = getInputFieldClassNames({
    size,
    disabled: isDisabled,
    labelDisplay: "flex"
  });
  const wrapperClassname = clsx("touch-none", className, width, {
    "flex items-center": inline
  });
  return /* @__PURE__ */ jsxs("div", { className: wrapperClassname, role: "group", id: groupId, children: [
    (label || showValueLabel) && /* @__PURE__ */ jsxs("div", { className: clsx(style.label, "select-none"), children: [
      label && /* @__PURE__ */ jsx(
        "label",
        {
          onClick: () => {
            var _a2;
            (_a2 = document.getElementById(thumbIds[0])) == null ? void 0 : _a2.focus();
          },
          id: labelId,
          htmlFor: groupId,
          children: label
        }
      ),
      showValueLabel && /* @__PURE__ */ jsx(
        "output",
        {
          htmlFor: thumbIds[0],
          className: "ml-auto text-right",
          "aria-live": "off",
          style: !maxLabelLength ? void 0 : {
            width: `${maxLabelLength}ch`,
            minWidth: `${maxLabelLength}ch`
          },
          children: outputValue
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: trackRef,
        className: clsx("relative", getWrapperHeight(props)),
        ...domProps,
        role: "presentation",
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: clsx(
                "absolute inset-0 m-auto rounded",
                getTrackColor(trackColor, isDisabled),
                getTrackHeight(size)
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: clsx(
                "absolute inset-0 my-auto rounded",
                getFillColor(fillColor, isDisabled),
                getTrackHeight(size)
              ),
              style: { width: `${Math.max(getThumbPercent(0) * 100, 0)}%` }
            }
          ),
          children
        ]
      }
    )
  ] });
}
function getWrapperHeight({ size, wrapperHeight }) {
  if (wrapperHeight)
    return wrapperHeight;
  switch (size) {
    case "xs":
      return "h-14";
    case "sm":
      return "h-20";
    default:
      return "h-30";
  }
}
function getTrackHeight(size) {
  switch (size) {
    case "xs":
      return "h-2";
    case "sm":
      return "h-3";
    default:
      return "h-4";
  }
}
function getTrackColor(color, isDisabled) {
  if (isDisabled) {
    color = "disabled";
  }
  switch (color) {
    case "disabled":
      return "bg-slider-disabled/60";
    case "primary":
      return "bg-primary-light";
    case "neutral":
      return "bg-divider";
    default:
      return color;
  }
}
function getFillColor(color, isDisabled) {
  if (isDisabled) {
    color = "disabled";
  }
  switch (color) {
    case "disabled":
      return "bg-slider-disabled";
    case "primary":
      return "bg-primary";
    default:
      return color;
  }
}
function useSlider({
  minValue = 0,
  maxValue = 100,
  isDisabled = false,
  step = 1,
  formatOptions,
  onChangeEnd,
  onPointerDown,
  label,
  getValueLabel,
  showThumbOnHoverOnly,
  thumbSize,
  onPointerMove,
  ...props
}) {
  const [isPointerOver, setIsPointerOver] = useState(false);
  const numberFormatter = useNumberFormatter(formatOptions);
  const { addGlobalListener, removeGlobalListener } = useGlobalListeners();
  const trackRef = useRef(null);
  const [values, setValues] = useControlledState(
    props.value ? props.value : void 0,
    props.defaultValue ?? [minValue],
    props.onChange
  );
  const valuesRef = useRef(null);
  valuesRef.current = values;
  const [draggedThumbs, setDraggedThumbs] = useState(
    new Array(values.length).fill(false)
  );
  const draggedThumbsRef = useRef(null);
  draggedThumbsRef.current = draggedThumbs;
  function getFormattedValue(value) {
    return numberFormatter.format(value);
  }
  const isThumbDragging = (index) => {
    var _a2;
    return ((_a2 = draggedThumbsRef.current) == null ? void 0 : _a2[index]) || false;
  };
  const getThumbValueLabel = (index) => getFormattedValue(values[index]);
  const getThumbMinValue = (index) => index === 0 ? minValue : values[index - 1];
  const getThumbMaxValue = (index) => index === values.length - 1 ? maxValue : values[index + 1];
  const setThumbValue = (index, value) => {
    if (isDisabled || !isThumbEditable(index) || !valuesRef.current) {
      return;
    }
    const thisMin = getThumbMinValue(index);
    const thisMax = getThumbMaxValue(index);
    value = snapValueToStep(value, thisMin, thisMax, step);
    valuesRef.current = replaceIndex(valuesRef.current, index, value);
    setValues(valuesRef.current);
  };
  const updateDraggedThumbs = (index, dragging) => {
    var _a2;
    if (isDisabled || !isThumbEditable(index)) {
      return;
    }
    const wasDragging = (_a2 = draggedThumbsRef.current) == null ? void 0 : _a2[index];
    draggedThumbsRef.current = replaceIndex(
      draggedThumbsRef.current || [],
      index,
      dragging
    );
    setDraggedThumbs(draggedThumbsRef.current);
    if (onChangeEnd && wasDragging && !draggedThumbsRef.current.some(Boolean)) {
      onChangeEnd(valuesRef.current || []);
    }
  };
  const [focusedThumb, setFocusedThumb] = useState(
    void 0
  );
  const getValuePercent = (value) => {
    const x = Math.min(1, (value - minValue) / (maxValue - minValue));
    if (isNaN(x)) {
      return 0;
    }
    return x;
  };
  const getThumbPercent = (index) => getValuePercent(valuesRef.current[index]);
  const setThumbPercent = (index, percent) => {
    setThumbValue(index, getPercentValue(percent));
  };
  const getRoundedValue = (value) => Math.round((value - minValue) / step) * step + minValue;
  const getPercentValue = (percent) => {
    const val = percent * (maxValue - minValue) + minValue;
    return clamp(getRoundedValue(val), minValue, maxValue);
  };
  const editableThumbsRef = useRef(
    new Array(values.length).fill(true)
  );
  const isThumbEditable = (index) => editableThumbsRef.current[index];
  const setThumbEditable = (index, editable) => {
    editableThumbsRef.current[index] = editable;
  };
  const realTimeTrackDraggingIndex = useRef(null);
  const currentPointer = useRef(void 0);
  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse" && (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)) {
      return;
    }
    onPointerDown == null ? void 0 : onPointerDown();
    if (trackRef.current && !isDisabled && values.every((_, i) => !draggedThumbs[i])) {
      const size = trackRef.current.offsetWidth;
      const trackPosition = trackRef.current.getBoundingClientRect().left;
      const offset = e.clientX - trackPosition;
      const percent = offset / size;
      const value = getPercentValue(percent);
      let closestThumb;
      const split = values.findIndex((v) => value - v < 0);
      if (split === 0) {
        closestThumb = split;
      } else if (split === -1) {
        closestThumb = values.length - 1;
      } else {
        const lastLeft = values[split - 1];
        const firstRight = values[split];
        if (Math.abs(lastLeft - value) < Math.abs(firstRight - value)) {
          closestThumb = split - 1;
        } else {
          closestThumb = split;
        }
      }
      if (closestThumb >= 0 && isThumbEditable(closestThumb)) {
        e.preventDefault();
        realTimeTrackDraggingIndex.current = closestThumb;
        setFocusedThumb(closestThumb);
        currentPointer.current = e.pointerId;
        updateDraggedThumbs(realTimeTrackDraggingIndex.current, true);
        setThumbValue(closestThumb, value);
        addGlobalListener(window, "pointerup", onUpTrack, false);
      } else {
        realTimeTrackDraggingIndex.current = null;
      }
    }
  };
  const currentPosition = useRef(null);
  const { domProps: moveDomProps } = usePointerEvents({
    onPointerDown: handlePointerDown,
    onMoveStart() {
      currentPosition.current = null;
    },
    onMove(e, deltaX) {
      var _a2;
      const size = ((_a2 = trackRef.current) == null ? void 0 : _a2.offsetWidth) || 0;
      if (currentPosition.current == null) {
        currentPosition.current = getThumbPercent(realTimeTrackDraggingIndex.current || 0) * size;
      }
      currentPosition.current += deltaX;
      if (realTimeTrackDraggingIndex.current != null && trackRef.current) {
        const percent = clamp(currentPosition.current / size, 0, 1);
        setThumbPercent(realTimeTrackDraggingIndex.current, percent);
      }
    },
    onMoveEnd() {
      if (realTimeTrackDraggingIndex.current != null) {
        updateDraggedThumbs(realTimeTrackDraggingIndex.current, false);
        realTimeTrackDraggingIndex.current = null;
      }
    }
  });
  const domProps = mergeProps(moveDomProps, {
    onPointerEnter: () => {
      setIsPointerOver(true);
    },
    onPointerLeave: () => {
      setIsPointerOver(false);
    },
    onPointerMove: (e) => {
      onPointerMove == null ? void 0 : onPointerMove(e);
    }
  });
  const onUpTrack = (e) => {
    const id2 = e.pointerId;
    if (id2 === currentPointer.current) {
      if (realTimeTrackDraggingIndex.current != null) {
        updateDraggedThumbs(realTimeTrackDraggingIndex.current, false);
        realTimeTrackDraggingIndex.current = null;
      }
      removeGlobalListener(window, "pointerup", onUpTrack, false);
    }
  };
  const id = useId();
  const labelId = label ? `${id}-label` : void 0;
  const groupId = `${id}-group`;
  const thumbIds = [...Array(values.length)].map((v, i) => {
    return `${id}-thumb-${i}`;
  });
  return {
    domProps,
    trackRef,
    isDisabled,
    step,
    values,
    minValue,
    maxValue,
    focusedThumb,
    labelId,
    groupId,
    thumbIds,
    numberFormatter,
    getThumbPercent,
    getThumbMinValue,
    getThumbMaxValue,
    getThumbValueLabel,
    isThumbDragging,
    setThumbValue,
    updateDraggedThumbs,
    setThumbEditable,
    setFocusedThumb,
    getValueLabel,
    isPointerOver,
    showThumbOnHoverOnly,
    thumbSize
  };
}
function replaceIndex(array, index, value) {
  if (array[index] === value) {
    return array;
  }
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}
function SliderThumb({
  index,
  slider,
  isDisabled: isThumbDisabled,
  ariaLabel,
  inputRef,
  onBlur,
  fillColor = "primary"
}) {
  const inputObjRef = useObjectRef(inputRef);
  const { addGlobalListener, removeGlobalListener } = useGlobalListeners();
  const {
    step,
    values,
    focusedThumb,
    labelId,
    thumbIds,
    isDisabled: isSliderDisabled,
    getThumbPercent,
    getThumbMinValue,
    getThumbMaxValue,
    getThumbValueLabel,
    setThumbValue,
    updateDraggedThumbs,
    isThumbDragging,
    setThumbEditable,
    setFocusedThumb,
    isPointerOver,
    showThumbOnHoverOnly,
    thumbSize = "w-18 h-18"
  } = slider;
  const isDragging = isThumbDragging(index);
  const value = values[index];
  setThumbEditable(index, !isThumbDisabled);
  const isDisabled = isThumbDisabled || isSliderDisabled;
  const focusInput = useCallback(() => {
    if (inputObjRef.current) {
      inputObjRef.current.focus({ preventScroll: true });
    }
  }, [inputObjRef]);
  const isFocused = focusedThumb === index;
  useEffect(() => {
    if (isFocused) {
      focusInput();
    }
  }, [isFocused, focusInput]);
  const currentPointer = useRef(void 0);
  const handlePointerUp = (e) => {
    if (e.pointerId === currentPointer.current) {
      focusInput();
      updateDraggedThumbs(index, false);
      removeGlobalListener(window, "pointerup", handlePointerUp, false);
    }
  };
  const className = clsx(
    "outline-none rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 absolute inset-0 transition-button duration-200",
    thumbSize,
    !isDisabled && "shadow-md",
    thumbColor({ fillColor, isDisabled, isDragging }),
    // show thumb on hover and while dragging, otherwise "blur" event will fire on thumb and dragging will stop
    !showThumbOnHoverOnly || showThumbOnHoverOnly && isDragging || isPointerOver ? "visible" : "invisible"
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "presentation",
      className,
      style: {
        left: `${Math.max(getThumbPercent(index) * 100, 0)}%`
      },
      onPointerDown: (e) => {
        if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey) {
          return;
        }
        focusInput();
        currentPointer.current = e.pointerId;
        updateDraggedThumbs(index, true);
        addGlobalListener(window, "pointerup", handlePointerUp, false);
      },
      children: /* @__PURE__ */ jsx(
        "input",
        {
          id: thumbIds[index],
          onKeyDown: createEventHandler(() => {
            updateDraggedThumbs(index, true);
          }),
          onKeyUp: createEventHandler(() => {
            updateDraggedThumbs(index, false);
          }),
          ref: inputObjRef,
          tabIndex: !isDisabled ? 0 : void 0,
          min: getThumbMinValue(index),
          max: getThumbMaxValue(index),
          step,
          value,
          disabled: isDisabled,
          "aria-label": ariaLabel,
          "aria-labelledby": labelId,
          "aria-orientation": "horizontal",
          "aria-valuetext": getThumbValueLabel(index),
          onFocus: () => {
            setFocusedThumb(index);
          },
          onBlur: (e) => {
            setFocusedThumb(void 0);
            updateDraggedThumbs(index, false);
            onBlur == null ? void 0 : onBlur(e);
          },
          onChange: (e) => {
            setThumbValue(index, parseFloat(e.target.value));
          },
          type: "range",
          className: "sr-only"
        }
      )
    }
  );
}
function thumbColor({
  isDisabled,
  isDragging,
  fillColor
}) {
  if (isDisabled) {
    return "bg-slider-disabled cursor-default";
  }
  if (fillColor && fillColor !== "primary") {
    return fillColor;
  }
  return clsx(
    "hover:bg-primary-dark",
    isDragging ? "bg-primary-dark" : "bg-primary"
  );
}
function Slider({ inputRef, onBlur, ...props }) {
  const { onChange, onChangeEnd, value, defaultValue, ...otherProps } = props;
  const baseProps = {
    ...otherProps,
    // Normalize `value: number[]` to `value: number`
    value: value != null ? [value] : void 0,
    defaultValue: defaultValue != null ? [defaultValue] : void 0,
    onChange: (v) => {
      onChange == null ? void 0 : onChange(v[0]);
    },
    onChangeEnd: (v) => {
      onChangeEnd == null ? void 0 : onChangeEnd(v[0]);
    }
  };
  const slider = useSlider(baseProps);
  return /* @__PURE__ */ jsx(BaseSlider, { ...baseProps, slider, children: /* @__PURE__ */ jsx(
    SliderThumb,
    {
      fillColor: props.fillColor,
      index: 0,
      slider,
      inputRef,
      onBlur
    }
  ) });
}
function FormSlider({ name, ...props }) {
  const {
    field: { onChange, onBlur, value = "", ref }
  } = useController({
    name
  });
  const formProps = {
    onChange,
    onBlur,
    value: value || ""
    // avoid issues with "null" value when setting form defaults from backend model
  };
  return /* @__PURE__ */ jsx(Slider, { inputRef: ref, ...mergeProps(formProps, props) });
}
const AppearanceButton = forwardRef(
  ({ startIcon, children, className, description, ...other }, ref) => {
    return /* @__PURE__ */ jsxs(
      ButtonBase,
      {
        ref,
        display: "flex",
        className: clsx(
          "relative mb-10 h-54 w-full items-center gap-10 rounded-input border bg px-14 text-sm hover:bg-hover",
          className
        ),
        variant: null,
        ...other,
        children: [
          startIcon,
          /* @__PURE__ */ jsxs("span", { className: "block min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "block", children }),
            description && /* @__PURE__ */ jsx("span", { className: "block overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-muted", children: description })
          ] }),
          /* @__PURE__ */ jsx(
            KeyboardArrowRightIcon,
            {
              "aria-hidden": true,
              className: "ml-auto text-muted icon-sm"
            }
          )
        ]
      }
    );
  }
);
const ColorIcon = createSvgIcon(
  /* @__PURE__ */ jsx(
    "path",
    {
      stroke: "#E0E0E0",
      d: "M24,44c-7.168,0-13-5.816-13-12.971C11,24,24,4,24,4s13,20,13,27.029C37,38.184,31.168,44,24,44z"
    }
  )
);
function ColorSwatch({ onChange, value, colors }) {
  const presetButtons = colors.map((color) => {
    const isSelected = value === color;
    return /* @__PURE__ */ jsx(
      ButtonBase,
      {
        onClick: () => {
          onChange == null ? void 0 : onChange(color);
        },
        className: clsx(
          "relative block flex-shrink-0 w-26 h-26 border rounded",
          isSelected && "shadow-md"
        ),
        style: { backgroundColor: color },
        children: isSelected && /* @__PURE__ */ jsx("span", { className: "absolute inset-0 m-auto rounded-full w-8 h-8 bg-white" })
      },
      color
    );
  });
  return /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-6", children: presetButtons });
}
const ColorPresets = [
  {
    color: "rgb(255, 255, 255)",
    name: message("White")
  },
  {
    color: "rgb(239,245,245)",
    name: message("Solitude")
  },
  {
    color: "rgb(245,213,174)",
    name: message("Wheat")
  },
  {
    color: "rgb(253,227,167)",
    name: message("Cape Honey")
  },
  {
    color: "rgb(242,222,186)",
    name: message("Milk punch")
  },
  {
    color: "rgb(97,118,75)",
    name: message("Dingy"),
    foreground: "rgb(255, 255, 255)"
  },
  {
    color: "rgb(4, 147, 114)",
    name: message("Aquamarine"),
    foreground: "rgb(255, 255, 255)"
  },
  {
    color: "rgb(222,245,229)",
    name: message("Cosmic Latte")
  },
  {
    color: "rgb(233,119,119)",
    name: message("Geraldine"),
    foreground: "rgb(90,14,14)"
  },
  {
    color: "rgb(247,164,164)",
    name: message("Sundown")
  },
  {
    color: "rgb(30,139,195)",
    name: message("Pelorous"),
    foreground: "rgb(255, 255, 255)"
  },
  {
    color: "rgb(142,68,173)",
    name: message("Deep Lilac"),
    foreground: "rgb(255, 255, 255)"
  },
  {
    color: "rgb(108,74,182)",
    name: message("Blue marguerite"),
    foreground: "rgb(255, 255, 255)"
  },
  {
    color: "rgb(139,126,116)",
    name: message("Americano"),
    foreground: "rgb(255, 255, 255)"
  },
  {
    color: "rgb(0,0,0)",
    name: message("Black"),
    foreground: "rgb(255, 255, 255)"
  },
  {
    color: "rgb(64,66,88)",
    name: message("Blue zodiac"),
    foreground: "rgb(255, 255, 255)"
  },
  {
    color: "rgb(101,100,124)",
    name: message("Comet"),
    foreground: "rgb(255, 255, 255)"
  }
];
const DefaultPresets = ColorPresets.map(({ color }) => color).slice(0, 14);
function ColorPicker({
  defaultValue,
  onChange,
  colorPresets,
  showInput
}) {
  const [color, setColor] = useState(defaultValue);
  const presets = colorPresets || DefaultPresets;
  const style = getInputFieldClassNames({ size: "sm" });
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      HexColorPicker,
      {
        className: "!w-auto",
        color,
        onChange: (newColor) => {
          onChange == null ? void 0 : onChange(newColor);
          setColor(newColor);
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "py-20 px-12", children: [
      presets && /* @__PURE__ */ jsx(
        ColorSwatch,
        {
          colors: presets,
          onChange: (newColor) => {
            if (newColor) {
              const hex = parseColor(newColor).toString("hex");
              onChange == null ? void 0 : onChange(hex);
              setColor(hex);
            }
          },
          value: color
        }
      ),
      showInput && /* @__PURE__ */ jsx("div", { className: "pt-20", children: /* @__PURE__ */ jsx(
        HexColorInput,
        {
          autoComplete: "off",
          role: "textbox",
          autoCorrect: "off",
          spellCheck: "false",
          required: true,
          "aria-label": "Hex color",
          prefixed: true,
          className: style.input,
          color,
          onChange: (newColor) => {
            onChange == null ? void 0 : onChange(newColor);
            setColor(newColor);
          }
        }
      ) })
    ] })
  ] });
}
function ColorPickerDialog({
  hideFooter = false,
  showInput = true
}) {
  const { close, value, setValue, initialValue } = useDialogContext();
  return /* @__PURE__ */ jsxs(Dialog, { size: "2xs", children: [
    /* @__PURE__ */ jsx(
      ColorPicker,
      {
        showInput,
        defaultValue: initialValue ? initialValue : "",
        onChange: (newValue) => setValue(newValue)
      }
    ),
    !hideFooter && /* @__PURE__ */ jsxs(DialogFooter, { dividerTop: true, children: [
      /* @__PURE__ */ jsx(Button, { variant: "text", size: "xs", onClick: () => close(), children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          size: "xs",
          onClick: () => close(value),
          children: /* @__PURE__ */ jsx(Trans, { message: "Apply" })
        }
      )
    ] })
  ] });
}
function LandingPageSectionGeneral() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(HeaderSection, {}),
    /* @__PURE__ */ jsxs("div", { className: "my-24 border-y py-24", children: [
      /* @__PURE__ */ jsx(
        AppearanceButton,
        {
          to: "action-buttons",
          elementType: Link,
          className: "mb-20",
          children: /* @__PURE__ */ jsx(Trans, { message: "Action buttons" })
        }
      ),
      /* @__PURE__ */ jsx(AppearanceButton, { to: "primary-features", elementType: Link, children: /* @__PURE__ */ jsx(Trans, { message: "Primary features" }) }),
      /* @__PURE__ */ jsx(AppearanceButton, { to: "secondary-features", elementType: Link, children: /* @__PURE__ */ jsx(Trans, { message: "Secondary features" }) })
    ] }),
    /* @__PURE__ */ jsx(FooterSection, {})
  ] });
}
function HeaderSection() {
  const defaultImage = useAppearanceStore(
    (s) => {
      var _a2, _b;
      return (_b = (_a2 = s.defaults) == null ? void 0 : _a2.settings.homepage.appearance) == null ? void 0 : _b.headerImage;
    }
  );
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Header title" }),
        className: "mb-20",
        name: "settings.homepage.appearance.headerTitle",
        onFocus: () => {
          appearanceState().preview.setHighlight('[data-testid="headerTitle"]');
        }
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Header subtitle" }),
        className: "mb-30",
        inputElementType: "textarea",
        rows: 4,
        name: "settings.homepage.appearance.headerSubtitle",
        onFocus: () => {
          appearanceState().preview.setHighlight(
            '[data-testid="headerSubtitle"]'
          );
        }
      }
    ),
    /* @__PURE__ */ jsx(
      FormImageSelector,
      {
        name: "settings.homepage.appearance.headerImage",
        className: "mb-30",
        label: /* @__PURE__ */ jsx(Trans, { message: "Header image" }),
        defaultValue: defaultImage,
        diskPrefix: "homepage"
      }
    ),
    /* @__PURE__ */ jsx(
      FormSlider,
      {
        name: "settings.homepage.appearance.headerImageOpacity",
        label: /* @__PURE__ */ jsx(Trans, { message: "Header image opacity" }),
        minValue: 0,
        step: 0.1,
        maxValue: 1,
        formatOptions: { style: "percent" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mb-20 text-xs text-muted", children: /* @__PURE__ */ jsx(Trans, { message: "In order for overlay colors to appear, header image opacity will need to be less then 100%" }) }),
    /* @__PURE__ */ jsx(
      ColorPickerTrigger$1,
      {
        formKey: "settings.homepage.appearance.headerOverlayColor1",
        label: /* @__PURE__ */ jsx(Trans, { message: "Header overlay color 1" })
      }
    ),
    /* @__PURE__ */ jsx(
      ColorPickerTrigger$1,
      {
        formKey: "settings.homepage.appearance.headerOverlayColor2",
        label: /* @__PURE__ */ jsx(Trans, { message: "Header overlay color 2" })
      }
    )
  ] });
}
function FooterSection() {
  const defaultImage = useAppearanceStore(
    (s) => {
      var _a2, _b;
      return (_b = (_a2 = s.defaults) == null ? void 0 : _a2.settings.homepage.appearance) == null ? void 0 : _b.footerImage;
    }
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Footer title" }),
        className: "mb-20",
        name: "settings.homepage.appearance.footerTitle",
        onFocus: () => {
          appearanceState().preview.setHighlight('[data-testid="footerTitle"]');
        }
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Footer subtitle" }),
        className: "mb-20",
        name: "settings.homepage.appearance.footerSubtitle",
        onFocus: () => {
          appearanceState().preview.setHighlight(
            '[data-testid="footerSubtitle"]'
          );
        }
      }
    ),
    /* @__PURE__ */ jsx(
      FormImageSelector,
      {
        name: "settings.homepage.appearance.footerImage",
        className: "mb-30",
        label: /* @__PURE__ */ jsx(Trans, { message: "Footer background image" }),
        defaultValue: defaultImage,
        diskPrefix: "homepage"
      }
    )
  ] });
}
function ColorPickerTrigger$1({ label, formKey }) {
  const key = formKey;
  const { watch, setValue } = useFormContext();
  const formValue = watch(key);
  const setColor = (value) => {
    setValue(formKey, value, {
      shouldDirty: true
    });
  };
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "popover",
      value: formValue,
      alwaysReturnCurrentValueOnClose: true,
      onValueChange: (newValue) => setColor(newValue),
      onClose: (value) => setColor(value),
      children: [
        /* @__PURE__ */ jsx(
          AppearanceButton,
          {
            className: "capitalize",
            startIcon: /* @__PURE__ */ jsx(
              ColorIcon,
              {
                viewBox: "0 0 48 48",
                className: "icon-lg",
                style: { fill: formValue }
              }
            ),
            children: label
          }
        ),
        /* @__PURE__ */ jsx(ColorPickerDialog, {})
      ]
    }
  );
}
function ucFirst(string) {
  if (!string)
    return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const PermissionSelector$1 = React.forwardRef(({ valueListKey = "permissions", ...props }, ref) => {
  const { data } = useValueLists([valueListKey]);
  const permissions = (data == null ? void 0 : data.permissions) || (data == null ? void 0 : data.workspacePermissions);
  const [value, setValue] = useControlledState(props.value, [], props.onChange);
  const [showAdvanced, setShowAdvanced] = useState(false);
  if (!permissions)
    return null;
  const groupedPermissions = buildPermissionList(
    permissions,
    value,
    showAdvanced
  );
  const onRestrictionChange = (newPermission) => {
    const newValue = [...value];
    const index = newValue.findIndex((p) => p.id === newPermission.id);
    if (index > -1) {
      newValue.splice(index, 1, newPermission);
    }
    setValue(newValue);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Accordion, { variant: "outline", ref, children: groupedPermissions.map(({ groupName, items, anyChecked }) => /* @__PURE__ */ jsx(
      AccordionItem,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: prettyName(groupName) }),
        startIcon: anyChecked ? /* @__PURE__ */ jsx(DoneAllIcon, { size: "sm" }) : void 0,
        children: /* @__PURE__ */ jsx(List, { children: items.map((permission) => {
          const index = value.findIndex((v) => v.id === permission.id);
          const isChecked = index > -1;
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              ListItem,
              {
                onSelected: () => {
                  if (isChecked) {
                    const newValue = [...value];
                    newValue.splice(index, 1);
                    setValue(newValue);
                  } else {
                    setValue([...value, permission]);
                  }
                },
                endSection: /* @__PURE__ */ jsx(
                  Switch,
                  {
                    tabIndex: -1,
                    checked: isChecked,
                    onChange: () => {
                    }
                  }
                ),
                description: /* @__PURE__ */ jsx(Trans, { message: permission.description }),
                children: /* @__PURE__ */ jsx(
                  Trans,
                  {
                    message: permission.display_name || permission.name
                  }
                )
              }
            ),
            isChecked && /* @__PURE__ */ jsx(
              Restrictions,
              {
                permission,
                onChange: onRestrictionChange
              }
            )
          ] }, permission.id);
        }) })
      },
      groupName
    )) }),
    /* @__PURE__ */ jsx(
      Switch,
      {
        className: "mt-30",
        checked: showAdvanced,
        onChange: (e) => {
          setShowAdvanced(e.target.checked);
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Show advanced permissions" })
      }
    )
  ] });
});
function Restrictions({ permission, onChange }) {
  var _a2;
  if (!((_a2 = permission == null ? void 0 : permission.restrictions) == null ? void 0 : _a2.length))
    return null;
  const setRestrictionValue = (name, value) => {
    const nextState = produce(permission, (draftState) => {
      const restriction = draftState.restrictions.find((r) => r.name === name);
      if (restriction) {
        restriction.value = value;
      }
    });
    onChange == null ? void 0 : onChange(nextState);
  };
  return /* @__PURE__ */ jsx("div", { className: "px-40 py-20", children: permission.restrictions.map((restriction, index) => {
    const isLast = index === permission.restrictions.length - 1;
    const name = /* @__PURE__ */ jsx(Trans, { message: prettyName(restriction.name) });
    const description = restriction.description ? /* @__PURE__ */ jsx(Trans, { message: restriction.description }) : void 0;
    if (restriction.type === "bool") {
      return /* @__PURE__ */ jsx(
        Switch,
        {
          description,
          className: clsx(!isLast && "mb-30"),
          checked: Boolean(restriction.value),
          onChange: (e) => {
            setRestrictionValue(restriction.name, e.target.checked);
          },
          children: name
        },
        restriction.name
      );
    }
    return /* @__PURE__ */ jsx(
      TextField,
      {
        size: "sm",
        label: name,
        description,
        type: "number",
        className: clsx(!isLast && "mb-30"),
        value: restriction.value || "",
        onChange: (e) => {
          setRestrictionValue(
            restriction.name,
            e.target.value === "" ? void 0 : parseInt(e.target.value)
          );
        }
      },
      restriction.name
    );
  }) });
}
function FormPermissionSelector(props) {
  const {
    field: { onChange, value = [], ref }
  } = useController({
    name: props.name
  });
  const formProps = {
    onChange,
    value
  };
  return /* @__PURE__ */ jsx(PermissionSelector$1, { ref, ...mergeProps(formProps, props) });
}
const prettyName = (name) => {
  return ucFirst(name.replace("_", " "));
};
function buildPermissionList(allPermissions, selectedPermissions, showAdvanced) {
  const groupedPermissions = [];
  allPermissions.forEach((permission) => {
    const index = selectedPermissions.findIndex((p) => p.id === permission.id);
    if (!showAdvanced && permission.advanced)
      return;
    let group = groupedPermissions.find(
      (g) => g.groupName === permission.group
    );
    if (!group) {
      group = { groupName: permission.group, anyChecked: false, items: [] };
      groupedPermissions.push(group);
    }
    if (index > -1) {
      const mergedPermission = {
        ...permission,
        restrictions: mergeRestrictions(
          permission.restrictions,
          selectedPermissions[index].restrictions
        )
      };
      group.anyChecked = true;
      group.items.push(mergedPermission);
    } else {
      group.items.push(permission);
    }
  });
  return groupedPermissions;
}
function mergeRestrictions(allRestrictions, selectedRestrictions) {
  return allRestrictions == null ? void 0 : allRestrictions.map((restriction) => {
    const selected = selectedRestrictions.find(
      (r) => r.name === restriction.name
    );
    if (selected) {
      return { ...restriction, value: selected.value };
    } else {
      return restriction;
    }
  });
}
function useAvailableRoutes() {
  const menuConfig = mergedAppearanceConfig.sections.menus.config;
  if (!menuConfig)
    return [];
  return menuConfig.availableRoutes.map((route) => {
    return {
      id: route,
      label: route,
      action: route,
      type: "route",
      target: "_self"
    };
  });
}
const iconGridStyle = {
  grid: "flex flex-wrap gap-24",
  button: "flex flex-col items-center rounded hover:bg-hover h-90 aspect-square"
};
const skeletons = [...Array(60).keys()];
const IconList = React.lazy(() => import("./icon-list-8f8a41be.mjs"));
function IconPicker({ onIconSelected }) {
  const { trans } = useTrans();
  const [value, setValue] = React.useState("");
  return /* @__PURE__ */ jsxs("div", { className: "py-4", children: [
    /* @__PURE__ */ jsx(
      TextField,
      {
        className: "mb-20",
        value,
        onChange: (e) => {
          setValue(e.target.value);
        },
        placeholder: trans({ message: "Search icons..." })
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
      Suspense,
      {
        fallback: /* @__PURE__ */ jsx(m.div, { ...opacityAnimation, className: iconGridStyle.grid, children: skeletons.map((_, index) => /* @__PURE__ */ jsx("div", { className: iconGridStyle.button, children: /* @__PURE__ */ jsx(Skeleton, { variant: "rect" }) }, index)) }),
        children: /* @__PURE__ */ jsx(m.div, { ...opacityAnimation, className: iconGridStyle.grid, children: /* @__PURE__ */ jsx(IconList, { searchQuery: value, onIconSelected }) })
      }
    ) })
  ] });
}
function IconPickerDialog() {
  return /* @__PURE__ */ jsxs(Dialog, { size: "w-850", className: "min-h-dialog", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Select icon" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(IconPickerWrapper, {}) })
  ] });
}
function IconPickerWrapper() {
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsx(
    IconPicker,
    {
      onIconSelected: (value) => {
        close(value);
      }
    }
  );
}
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
function MenuItemForm({
  formPathPrefix,
  hideRoleAndPermissionFields
}) {
  const { trans } = useTrans();
  const prefixName = (name) => {
    return formPathPrefix ? `${formPathPrefix}.${name}` : name;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        className: "mb-20",
        name: prefixName("label"),
        label: /* @__PURE__ */ jsx(Trans, { message: "Label" }),
        placeholder: trans(message("No label...")),
        startAppend: /* @__PURE__ */ jsx(IconDialogTrigger, { prefixName })
      }
    ),
    /* @__PURE__ */ jsx(DestinationSelector, { prefixName }),
    !hideRoleAndPermissionFields && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(RoleSelector, { prefixName }),
      /* @__PURE__ */ jsx(PermissionSelector, { prefixName })
    ] }),
    /* @__PURE__ */ jsx(TargetSelect, { prefixName })
  ] });
}
function IconDialogTrigger({
  prefixName,
  ...buttonProps
}) {
  const { watch, setValue } = useFormContext();
  const fieldName = prefixName("icon");
  const watchedItemIcon = watch(fieldName);
  const Icon = watchedItemIcon && createSvgIconFromTree(watchedItemIcon);
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (iconTree) => {
        if (iconTree || iconTree === null) {
          setValue(fieldName, iconTree, {
            shouldDirty: true
          });
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          IconButton,
          {
            className: "text-muted icon-sm",
            variant: "outline",
            size: "md",
            ...buttonProps,
            children: Icon ? /* @__PURE__ */ jsx(Icon, {}) : /* @__PURE__ */ jsx(EditIcon, {})
          }
        ),
        /* @__PURE__ */ jsx(IconPickerDialog, {})
      ]
    }
  );
}
function DestinationSelector({ prefixName }) {
  const form = useFormContext();
  const currentType = form.watch(prefixName("type"));
  const previousType = usePrevious(currentType);
  const { data } = useValueLists(["menuItemCategories"]);
  const categories = (data == null ? void 0 : data.menuItemCategories) || [];
  const selectedCategory = categories.find((c) => c.type === currentType);
  const { trans } = useTrans();
  const routeItems = useAvailableRoutes();
  useEffect(() => {
    if (previousType && previousType !== currentType) {
      form.setValue(prefixName("action"), "");
    }
  }, [currentType, previousType, form, prefixName]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      FormSelect,
      {
        className: "mb-20",
        name: prefixName("type"),
        selectionMode: "single",
        label: /* @__PURE__ */ jsx(Trans, { message: "Type" }),
        children: [
          /* @__PURE__ */ jsx(Item, { value: "link", children: /* @__PURE__ */ jsx(Trans, { message: "Custom link" }) }),
          /* @__PURE__ */ jsx(Item, { value: "route", children: /* @__PURE__ */ jsx(Trans, { message: "Site page" }) }),
          categories.map((category) => /* @__PURE__ */ jsx(Item, { value: category.type, children: category.name }, category.type))
        ]
      }
    ),
    currentType === "link" && /* @__PURE__ */ jsx(
      FormTextField,
      {
        className: "mb-20",
        required: true,
        type: "url",
        name: prefixName("action"),
        placeholder: trans({ message: "Enter a url..." }),
        label: /* @__PURE__ */ jsx(Trans, { message: "Url" })
      }
    ),
    currentType === "route" && /* @__PURE__ */ jsx(
      FormSelect,
      {
        className: "mb-20",
        required: true,
        items: routeItems,
        name: prefixName("action"),
        label: /* @__PURE__ */ jsx(Trans, { message: "Page" }),
        searchPlaceholder: trans(message("Search pages")),
        showSearchField: true,
        selectionMode: "single",
        children: (item) => /* @__PURE__ */ jsx(Item, { value: item.id, children: item.label }, item.id)
      }
    ),
    selectedCategory && /* @__PURE__ */ jsx(
      FormSelect,
      {
        className: "mb-20",
        required: true,
        items: selectedCategory.items,
        name: prefixName("action"),
        showSearchField: true,
        searchPlaceholder: trans(message("Search...")),
        selectionMode: "single",
        label: /* @__PURE__ */ jsx(Trans, { message: selectedCategory.name }),
        children: (item) => /* @__PURE__ */ jsx(Item, { value: item.action, children: /* @__PURE__ */ jsx(Trans, { message: item.label }) })
      }
    )
  ] });
}
function RoleSelector({ prefixName }) {
  const { data } = useValueLists(["roles", "permissions"]);
  const roles = (data == null ? void 0 : data.roles) || [];
  const { trans } = useTrans();
  return /* @__PURE__ */ jsx(
    FormChipField,
    {
      className: "mb-20",
      placeholder: trans({ message: "Add role..." }),
      label: /* @__PURE__ */ jsx(Trans, { message: "Only show if user has role" }),
      name: prefixName("roles"),
      chipSize: "sm",
      suggestions: roles,
      valueKey: "id",
      displayWith: (c) => {
        var _a2;
        return (_a2 = roles.find((r) => r.id === c.id)) == null ? void 0 : _a2.name;
      },
      children: (role) => /* @__PURE__ */ jsx(Item, { value: role.id, capitalizeFirst: true, children: /* @__PURE__ */ jsx(Trans, { message: role.name }) }, role.id)
    }
  );
}
function PermissionSelector({ prefixName }) {
  const { data } = useValueLists(["roles", "permissions"]);
  const { trans } = useTrans();
  const groupedPermissions = useMemo(() => {
    return buildPermissionList((data == null ? void 0 : data.permissions) || [], [], false);
  }, [data == null ? void 0 : data.permissions]);
  return /* @__PURE__ */ jsx(
    FormChipField,
    {
      label: /* @__PURE__ */ jsx(Trans, { message: "Only show if user has permissions" }),
      placeholder: trans({ message: "Add permission..." }),
      chipSize: "sm",
      suggestions: groupedPermissions,
      name: prefixName("permissions"),
      valueKey: "name",
      children: ({ groupName, items }) => /* @__PURE__ */ jsx(Section, { label: prettyName(groupName), children: items.map((permission) => /* @__PURE__ */ jsx(
        Item,
        {
          value: permission.name,
          description: /* @__PURE__ */ jsx(Trans, { message: permission.description }),
          children: /* @__PURE__ */ jsx(Trans, { message: permission.display_name || permission.name })
        },
        permission.name
      )) }, groupName)
    }
  );
}
function TargetSelect({ prefixName }) {
  return /* @__PURE__ */ jsxs(
    FormSelect,
    {
      className: "mt-20",
      selectionMode: "single",
      name: prefixName("target"),
      label: /* @__PURE__ */ jsx(Trans, { message: "Open link in" }),
      children: [
        /* @__PURE__ */ jsx(Item, { value: "_self", children: /* @__PURE__ */ jsx(Trans, { message: "Same window" }) }),
        /* @__PURE__ */ jsx(Item, { value: "_blank", children: /* @__PURE__ */ jsx(Trans, { message: "New window" }) })
      ]
    }
  );
}
function LandingPageSectionActionButtons() {
  const [expandedValues, setExpandedValues] = useState(["cta1"]);
  return /* @__PURE__ */ jsxs(
    Accordion,
    {
      variant: "outline",
      expandedValues,
      onExpandedChange: (values) => {
        setExpandedValues(values);
        if (values.length) {
          appearanceState().preview.setHighlight(
            `[data-testid="${values[0]}"]`
          );
        }
      },
      children: [
        /* @__PURE__ */ jsx(AccordionItem, { value: "cta1", label: /* @__PURE__ */ jsx(Trans, { message: "Header button 1" }), children: /* @__PURE__ */ jsx(MenuItemForm, { formPathPrefix: "settings.homepage.appearance.actions.cta1" }) }),
        /* @__PURE__ */ jsx(AccordionItem, { value: "ct2", label: /* @__PURE__ */ jsx(Trans, { message: "Header button 2" }), children: /* @__PURE__ */ jsx(MenuItemForm, { formPathPrefix: "settings.homepage.appearance.actions.cta2" }) }),
        /* @__PURE__ */ jsx(AccordionItem, { value: "cta3", label: /* @__PURE__ */ jsx(Trans, { message: "Footer button" }), children: /* @__PURE__ */ jsx(MenuItemForm, { formPathPrefix: "settings.homepage.appearance.actions.cta3" }) })
      ]
    }
  );
}
function LandingPageSectionPrimaryFeatures() {
  const { fields, remove, append } = useFieldArray({
    name: "settings.homepage.appearance.primaryFeatures"
  });
  const [expandedValues, setExpandedValues] = useState([0]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      Accordion,
      {
        variant: "outline",
        expandedValues,
        onExpandedChange: (values) => {
          setExpandedValues(values);
          if (values.length) {
            appearanceState().preview.setHighlight(
              `[data-testid="primary-root-${values[0]}"]`
            );
          }
        },
        children: fields.map((field, index) => {
          return /* @__PURE__ */ jsxs(
            AccordionItem,
            {
              value: index,
              label: /* @__PURE__ */ jsx(Trans, { message: `Primary feature ${index + 1}` }),
              children: [
                /* @__PURE__ */ jsx(FeatureForm$1, { index }),
                /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "xs",
                    variant: "outline",
                    color: "danger",
                    onClick: () => {
                      remove(index);
                    },
                    children: /* @__PURE__ */ jsx(Trans, { message: "Remove" })
                  }
                ) })
              ]
            },
            field.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-20 text-right", children: /* @__PURE__ */ jsx(
      Button,
      {
        size: "xs",
        variant: "outline",
        color: "primary",
        startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
        onClick: () => {
          append({});
          setExpandedValues([fields.length]);
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Add feature" })
      }
    ) })
  ] });
}
function FeatureForm$1({ index }) {
  const defaultImage = useAppearanceStore(
    (s) => {
      var _a2, _b, _c;
      return (_c = (_b = (_a2 = s.defaults) == null ? void 0 : _a2.settings.homepage.appearance) == null ? void 0 : _b.primaryFeatures[index]) == null ? void 0 : _c.image;
    }
  );
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormImageSelector,
      {
        name: `settings.homepage.appearance.primaryFeatures.${index}.image`,
        className: "mb-30",
        label: /* @__PURE__ */ jsx(Trans, { message: "Image" }),
        defaultValue: defaultImage,
        diskPrefix: "homepage"
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        name: `settings.homepage.appearance.primaryFeatures.${index}.title`,
        label: /* @__PURE__ */ jsx(Trans, { message: "Title" }),
        className: "mb-20",
        onFocus: () => {
          appearanceState().preview.setHighlight(
            `[data-testid="primary-title-${index}"]`
          );
        }
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        name: `settings.homepage.appearance.primaryFeatures.${index}.subtitle`,
        label: /* @__PURE__ */ jsx(Trans, { message: "Subtitle" }),
        className: "mb-20",
        inputElementType: "textarea",
        rows: 4,
        onFocus: () => {
          appearanceState().preview.setHighlight(
            `[data-testid="primary-subtitle-${index}"]`
          );
        }
      }
    )
  ] });
}
function LandingPageSecondaryFeatures() {
  const { fields, remove, append } = useFieldArray({
    name: "settings.homepage.appearance.secondaryFeatures"
  });
  const [expandedValues, setExpandedValues] = useState([0]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      Accordion,
      {
        variant: "outline",
        expandedValues,
        onExpandedChange: (values) => {
          setExpandedValues(values);
          if (values.length) {
            appearanceState().preview.setHighlight(
              `[data-testid="secondary-root-${values[0]}"]`
            );
          }
        },
        children: fields.map((field, index) => {
          return /* @__PURE__ */ jsxs(
            AccordionItem,
            {
              value: index,
              label: /* @__PURE__ */ jsx(Trans, { message: `Secondary feature ${index + 1}` }),
              children: [
                /* @__PURE__ */ jsx(FeatureForm, { index }),
                /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    size: "xs",
                    variant: "outline",
                    color: "danger",
                    onClick: () => {
                      remove(index);
                    },
                    children: /* @__PURE__ */ jsx(Trans, { message: "Remove" })
                  }
                ) })
              ]
            },
            field.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-20 text-right", children: /* @__PURE__ */ jsx(
      Button,
      {
        size: "xs",
        variant: "outline",
        color: "primary",
        startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
        onClick: () => {
          append({});
          setExpandedValues([fields.length]);
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Add feature" })
      }
    ) })
  ] });
}
function FeatureForm({ index }) {
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormImageSelector,
      {
        name: `settings.homepage.appearance.secondaryFeatures.${index}.image`,
        className: "mb-30",
        label: /* @__PURE__ */ jsx(Trans, { message: "Image" }),
        defaultValue: getDefaultImage(index),
        diskPrefix: "homepage"
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        name: `settings.homepage.appearance.secondaryFeatures.${index}.title`,
        label: /* @__PURE__ */ jsx(Trans, { message: "Title" }),
        className: "mb-20",
        onFocus: () => {
          appearanceState().preview.setHighlight(
            `[data-testid="secondary-title-${index}"]`
          );
        }
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        name: `settings.homepage.appearance.secondaryFeatures.${index}.subtitle`,
        label: /* @__PURE__ */ jsx(Trans, { message: "Subtitle" }),
        className: "mb-20",
        inputElementType: "textarea",
        rows: 4,
        onFocus: () => {
          appearanceState().preview.setHighlight(
            `[data-testid="secondary-subtitle-${index}"]`
          );
        }
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        name: `settings.homepage.appearance.secondaryFeatures.${index}.description`,
        label: /* @__PURE__ */ jsx(Trans, { message: "Description" }),
        className: "mb-20",
        inputElementType: "textarea",
        rows: 4,
        onFocus: () => {
          appearanceState().preview.setHighlight(
            `[data-testid="secondary-description-${index}"]`
          );
        }
      }
    )
  ] });
}
function getDefaultImage(index) {
  var _a2, _b;
  return (_b = ((_a2 = appearanceState().defaults) == null ? void 0 : _a2.settings.homepage.appearance).secondaryFeatures[index]) == null ? void 0 : _b.image;
}
const AppAppearanceConfig = {
  preview: {
    defaultRoute: "drive",
    navigationRoutes: ["s", "drive"]
  },
  sections: {
    "landing-page": {
      label: message("Landing Page"),
      position: 1,
      previewRoute: "/",
      routes: [
        { path: "landing-page", element: /* @__PURE__ */ jsx(LandingPageSectionGeneral, {}) },
        {
          path: "landing-page/action-buttons",
          element: /* @__PURE__ */ jsx(LandingPageSectionActionButtons, {})
        },
        {
          path: "landing-page/primary-features",
          element: /* @__PURE__ */ jsx(LandingPageSectionPrimaryFeatures, {})
        },
        {
          path: "landing-page/secondary-features",
          element: /* @__PURE__ */ jsx(LandingPageSecondaryFeatures, {})
        }
      ],
      buildBreadcrumb: (pathname, formValue) => {
        const parts = pathname.split("/").filter((p) => !!p);
        const sectionName = parts.pop();
        const breadcrumb = [
          {
            label: message("Landing page"),
            location: "landing-page"
          }
        ];
        if (sectionName === "action-buttons") {
          breadcrumb.push({
            label: message("Action buttons"),
            location: "landing-page/action-buttons"
          });
        }
        if (sectionName === "primary-features") {
          breadcrumb.push({
            label: message("Primary features"),
            location: "landing-page/primary-features"
          });
        }
        if (sectionName === "secondary-features") {
          breadcrumb.push({
            label: message("Secondary features"),
            location: "landing-page/secondary-features"
          });
        }
        return breadcrumb;
      }
    },
    // missing label will get added by deepMerge from default config
    // @ts-ignore
    menus: {
      config: {
        positions: [
          "drive-navbar",
          "drive-sidebar",
          "homepage-navbar",
          "shareable-link-page",
          "footer",
          "footer-secondary"
        ],
        availableRoutes: [
          "/drive",
          "/drive/shares",
          "/drive/recent",
          "/drive/starred",
          "/drive/trash"
        ]
      }
    },
    // @ts-ignore
    "seo-settings": {
      config: {
        pages: [
          {
            key: "landing-page",
            label: message("Landing page")
          },
          {
            key: "shareable-link-page",
            label: message("Shareable link page")
          }
        ]
      }
    }
  }
};
const mergedAppearanceConfig = deepMerge.all([
  DefaultAppearanceConfig,
  AppAppearanceConfig
]);
const useAppearanceStore = create()(
  subscribeWithSelector(
    immer((set, get) => ({
      defaults: null,
      iframeWindow: null,
      config: mergedAppearanceConfig,
      setDefaults: (value) => {
        set((state) => {
          state.defaults = { ...value };
        });
      },
      setIframeWindow: (value) => {
        set(() => {
          return { iframeWindow: value };
        });
      },
      preview: {
        navigate: (sectionName) => {
          var _a2;
          const section = (_a2 = get().config) == null ? void 0 : _a2.sections[sectionName];
          const route = (section == null ? void 0 : section.previewRoute) || "/";
          const preview = get().iframeWindow;
          if (route) {
            postMessage(preview, { type: "navigate", to: route });
          }
        },
        setValues: (values) => {
          const preview = get().iframeWindow;
          postMessage(preview, { type: "setValues", values });
        },
        setThemeFont: (font) => {
          const preview = get().iframeWindow;
          postMessage(preview, { type: "setThemeFont", value: font });
        },
        setThemeValue: (name, value) => {
          const preview = get().iframeWindow;
          postMessage(preview, { type: "setThemeValue", name, value });
        },
        setActiveTheme: (themeId) => {
          const preview = get().iframeWindow;
          postMessage(preview, { type: "setActiveTheme", themeId });
        },
        setCustomCode: (mode, value) => {
          const preview = get().iframeWindow;
          postMessage(preview, { type: "setCustomCode", mode, value });
        },
        setHighlight: (selector) => {
          set(() => {
            var _a2;
            let node = null;
            const document2 = (_a2 = get().iframeWindow) == null ? void 0 : _a2.document;
            if (document2 && selector) {
              node = document2.querySelector(selector);
            }
            if (node) {
              requestAnimationFrame(() => {
                if (!node)
                  return;
                node.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "center"
                });
              });
            }
          });
        }
      }
    }))
  )
);
function postMessage(window2, command) {
  if (window2) {
    window2.postMessage({ source: "be-appearance-editor", ...command }, "*");
  }
}
function appearanceState() {
  return useAppearanceStore.getState();
}
function useSaveAppearanceChanges() {
  return useMutation({
    mutationFn: (values) => saveAppearanceChanges(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin/appearance/values"]
      });
      toast(message("Changes saved"));
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function saveAppearanceChanges(changes) {
  return apiClient.post(`admin/appearance`, { changes }).then((r) => r.data);
}
function useAppearanceValues() {
  return useQuery({
    queryKey: ["admin/appearance/values"],
    queryFn: () => fetchAppearanceValues(),
    staleTime: Infinity
  });
}
function fetchAppearanceValues() {
  return apiClient.get("admin/appearance/values").then((response) => response.data);
}
function SectionHeader() {
  const { pathname } = useLocation();
  const { getValues } = useFormContext();
  const [breadcrumb, setBreadcrumb] = useState(null);
  useEffect(() => {
    var _a2;
    const [, , sectionName] = pathname.split("/").filter((p) => !!p);
    if (sectionName) {
      const section = (_a2 = appearanceState().config) == null ? void 0 : _a2.sections[sectionName];
      if (section) {
        setBreadcrumb([
          {
            label: message("Appearance"),
            location: ""
          },
          ...section.buildBreadcrumb(pathname, getValues())
        ]);
        return;
      }
    }
    setBreadcrumb(null);
  }, [pathname, getValues]);
  if (!breadcrumb || breadcrumb.length < 2) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b h-60 flex-shrink-0", children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        iconSize: "md",
        radius: "rounded-none",
        className: "text-muted h-full w-50 flex-shrink-0",
        elementType: Link,
        to: `/admin/appearance/${breadcrumb[breadcrumb.length - 2].location}`,
        children: /* @__PURE__ */ jsx(KeyboardArrowLeftIcon, {})
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "border-l p-10 min-w-0", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted", children: /* @__PURE__ */ jsx(Trans, { message: "Customizing" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 text-sm mt-2", children: breadcrumb.map((item, index) => {
        const isLast = breadcrumb.length - 1 === index;
        const isFirst = index === 0;
        const label = /* @__PURE__ */ jsx(MixedText, { value: item.label });
        if (isFirst) {
          return null;
        }
        return /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: clsx(
                "whitespace-nowrap overflow-hidden overflow-ellipsis min-w-0",
                isLast && "text-primary",
                // don't overflow ellipses last item
                isLast ? "flex-shrink-0" : "flex-auto"
              ),
              children: label
            }
          ),
          !isLast && /* @__PURE__ */ jsx(KeyboardArrowRightIcon, { className: "icon-sm text-muted flex-shrink-0" })
        ] }, index);
      }) })
    ] })
  ] });
}
function AppearanceLayout() {
  const { isAppearanceEditorActive } = useAppearanceEditorMode();
  const { data } = useAppearanceValues();
  const { base_url } = useSettings();
  const iframeRef = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    if ((data == null ? void 0 : data.defaults) && !appearanceState().defaults) {
      appearanceState().setDefaults(data.defaults);
    }
  }, [data]);
  useEffect(() => {
    if (iframeRef.current) {
      appearanceState().setIframeWindow(iframeRef.current.contentWindow);
    }
  }, []);
  useEffect(() => {
    const sectionName = pathname.split("/")[3];
    appearanceState().preview.navigate(sectionName);
  }, [pathname]);
  if (isAppearanceEditorActive) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/admin" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "h-screen items-center md:flex", children: [
    /* @__PURE__ */ jsx(StaticPageTitle, { children: /* @__PURE__ */ jsx(Trans, { message: "Appearance" }) }),
    /* @__PURE__ */ jsx(Sidebar, { values: data == null ? void 0 : data.values }),
    /* @__PURE__ */ jsx("div", { className: "relative h-full flex-auto", children: /* @__PURE__ */ jsx(
      "iframe",
      {
        ref: iframeRef,
        className: "h-full w-full max-md:hidden",
        src: `${base_url}?appearanceEditor=true`
      }
    ) })
  ] });
}
function Sidebar({ values }) {
  const spinner = /* @__PURE__ */ jsx("div", { className: "flex h-full flex-auto items-center justify-center", children: /* @__PURE__ */ jsx(ProgressCircle, { isIndeterminate: true, "aria-label": "Loading editor" }) });
  return /* @__PURE__ */ jsx("div", { className: "relative z-10 h-full w-full border-r bg shadow-lg @container md:w-320", children: values ? /* @__PURE__ */ jsx(AppearanceForm, { defaultValues: values }) : spinner });
}
function AppearanceForm({ defaultValues }) {
  const form = useForm({ defaultValues });
  const { watch, reset } = form;
  const saveChanges = useSaveAppearanceChanges();
  useEffect(() => {
    const subscription = watch((value) => {
      appearanceState().preview.setValues(value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  return /* @__PURE__ */ jsxs(
    Form$1,
    {
      className: "flex h-full flex-col",
      form,
      onSubmit: (values) => {
        saveChanges.mutate(values, {
          onSuccess: () => reset(values)
        });
      },
      children: [
        /* @__PURE__ */ jsx(Header$2, { isLoading: saveChanges.isPending }),
        /* @__PURE__ */ jsx(SectionHeader, {}),
        /* @__PURE__ */ jsx("div", { className: "flex-auto overflow-y-auto px-14 py-20", children: /* @__PURE__ */ jsx(FileUploadProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }) })
      ]
    }
  );
}
function Header$2({ isLoading }) {
  const {
    formState: { dirtyFields }
  } = useFormContext();
  const isDirty = Object.keys(dirtyFields).length;
  return /* @__PURE__ */ jsxs("div", { className: "flex h-50 flex-shrink-0 items-center border-b pr-10", children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        border: "border-r",
        className: "text-muted",
        elementType: Link,
        to: "..",
        children: /* @__PURE__ */ jsx(CloseIcon, {})
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "pl-10", children: /* @__PURE__ */ jsx(Trans, { message: "Appearance editor" }) }),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "flat",
        color: "primary",
        className: "ml-auto block",
        disabled: !isDirty || isLoading,
        type: "submit",
        children: isDirty ? /* @__PURE__ */ jsx(Trans, { message: "Save" }) : /* @__PURE__ */ jsx(Trans, { message: "Saved" })
      }
    )
  ] });
}
function MenuList() {
  const navigate = useNavigate();
  const { trans } = useTrans();
  const { fields, append } = useFieldArray({
    name: "settings.menus",
    keyName: "key"
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { children: fields.map((field, index) => /* @__PURE__ */ jsx(AppearanceButton, { to: `${index}`, elementType: Link, children: field.name }, field.key)) }),
    /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        color: "primary",
        startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
        size: "xs",
        onClick: () => {
          const id = nanoid(10);
          append({
            name: trans(
              message("New menu :number", {
                values: { number: fields.length + 1 }
              })
            ),
            id,
            positions: [],
            items: []
          });
          navigate(`${fields.length}`);
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Create menu" })
      }
    ) })
  ] });
}
function AddMenuItemDialog({
  title = /* @__PURE__ */ jsx(Trans, { message: "Add menu item" })
}) {
  const { data } = useValueLists(["menuItemCategories"]);
  const categories = (data == null ? void 0 : data.menuItemCategories) || [];
  const routeItems = useAvailableRoutes();
  return /* @__PURE__ */ jsxs(Dialog, { size: "sm", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: title }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsxs(Accordion, { variant: "outline", children: [
      /* @__PURE__ */ jsx(
        AccordionItem,
        {
          label: /* @__PURE__ */ jsx(Trans, { message: "Link" }),
          bodyClassName: "max-h-240 overflow-y-auto",
          children: /* @__PURE__ */ jsx(AddCustomLink, {})
        }
      ),
      /* @__PURE__ */ jsx(
        AccordionItem,
        {
          label: /* @__PURE__ */ jsx(Trans, { message: "Route" }),
          bodyClassName: "max-h-240 overflow-y-auto",
          children: /* @__PURE__ */ jsx(AddRoute, { items: routeItems })
        }
      ),
      categories.map((category) => /* @__PURE__ */ jsx(
        AccordionItem,
        {
          label: /* @__PURE__ */ jsx(Trans, { message: category.name }),
          children: /* @__PURE__ */ jsx(AddRoute, { items: category.items })
        },
        category.name
      ))
    ] }) })
  ] });
}
function AddCustomLink() {
  const form = useForm({
    defaultValues: {
      id: nanoid(6),
      type: "link",
      target: "_blank"
    }
  });
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsxs(
    Form$1,
    {
      form,
      onSubmit: (value) => {
        close(value);
      },
      children: [
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            required: true,
            name: "label",
            label: /* @__PURE__ */ jsx(Trans, { message: "Label" }),
            className: "mb-20"
          }
        ),
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            required: true,
            type: "url",
            name: "action",
            placeholder: "https://",
            label: /* @__PURE__ */ jsx(Trans, { message: "Url" }),
            className: "mb-20"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(Button, { type: "submit", variant: "flat", color: "primary", size: "xs", children: /* @__PURE__ */ jsx(Trans, { message: "Add to menu" }) }) })
      ]
    }
  );
}
function AddRoute({ items }) {
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsx(List, { children: items.map((item) => {
    return /* @__PURE__ */ jsx(
      ListItem,
      {
        startIcon: /* @__PURE__ */ jsx(AddIcon, { size: "sm" }),
        onSelected: () => {
          if (item.label) {
            const last = item.label.split("/").pop();
            item.label = last ? ucFirst(last) : item.label;
            item.id = nanoid(6);
          }
          close(item);
        },
        children: item.label
      },
      item.id
    );
  }) });
}
const DragIndicatorIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }),
  "DragIndicatorOutlined"
);
const dropdownMenu = "/assets/dropdown-menu-c9b3bd6a.svg";
const sortableLineStrategy = {
  onDragStart: () => {
  },
  onDragEnter: () => {
  },
  onDragOver: ({ e, ref, item, sortSession: sortSession2, onDropPositionChange }) => {
    var _a2;
    const previousPosition = sortSession2.dropPosition;
    let newPosition = null;
    const rect = (_a2 = droppables.get(item)) == null ? void 0 : _a2.rect;
    if (rect) {
      const midY = rect.top + rect.height / 2;
      if (e.clientY <= midY) {
        newPosition = "before";
      } else if (e.clientY >= midY) {
        newPosition = "after";
      }
    }
    if (newPosition !== previousPosition) {
      const overIndex = sortSession2.sortables.indexOf(item);
      sortSession2.dropPosition = newPosition;
      onDropPositionChange == null ? void 0 : onDropPositionChange(sortSession2.dropPosition);
      clearLinePreview(sortSession2);
      if (ref.current) {
        if (sortSession2.dropPosition === "after") {
          addLinePreview(ref.current, "bottom", sortSession2);
        } else {
          if (overIndex === 0) {
            addLinePreview(ref.current, "top", sortSession2);
          } else {
            const droppableId = sortSession2.sortables[overIndex - 1];
            const droppable = droppables.get(droppableId);
            if (droppable == null ? void 0 : droppable.ref.current) {
              addLinePreview(droppable.ref.current, "bottom", sortSession2);
            }
          }
        }
      }
      const itemIndex = sortSession2.sortables.indexOf(item);
      if (sortSession2.activeIndex === itemIndex) {
        sortSession2.finalIndex = sortSession2.activeIndex;
        return;
      }
      const dragDirection = overIndex > sortSession2.activeIndex ? "after" : "before";
      if (dragDirection === "after") {
        sortSession2.finalIndex = sortSession2.dropPosition === "before" ? itemIndex - 1 : itemIndex;
      } else {
        sortSession2.finalIndex = sortSession2.dropPosition === "after" ? itemIndex + 1 : itemIndex;
      }
    }
  },
  onDragEnd: (sortSession2) => {
    clearLinePreview(sortSession2);
  }
};
function clearLinePreview(sortSession2) {
  if (sortSession2 == null ? void 0 : sortSession2.linePreviewEl) {
    sortSession2.linePreviewEl.style.borderBottomColor = "";
    sortSession2.linePreviewEl.style.borderTopColor = "";
    sortSession2.linePreviewEl = void 0;
  }
}
function addLinePreview(el, side, sortSession2) {
  const color = "rgb(var(--be-primary))";
  if (side === "top") {
    el.style.borderTopColor = color;
  } else {
    el.style.borderBottomColor = color;
  }
  if (sortSession2) {
    sortSession2.linePreviewEl = el;
  }
}
function moveItemInArray(array, fromIndex, toIndex) {
  const from = clamp(fromIndex, 0, array.length - 1);
  const to = clamp(toIndex, 0, array.length - 1);
  if (from === to) {
    return array;
  }
  const target = array[from];
  const delta = to < from ? -1 : 1;
  for (let i = from; i !== to; i += delta) {
    array[i] = array[i + delta];
  }
  array[to] = target;
  return array;
}
function moveItemInNewArray(array, from, to) {
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0]
  );
  return newArray;
}
const transition = "transform 0.2s cubic-bezier(0.2, 0, 0, 1)";
const sortableTransformStrategy = {
  onDragStart: (sortSession2) => {
    sortSession2.sortables.forEach((sortable, index) => {
      const droppable = droppables.get(sortable);
      if (!(droppable == null ? void 0 : droppable.ref.current))
        return;
      droppable.ref.current.style.transition = transition;
      if ((sortSession2 == null ? void 0 : sortSession2.activeIndex) === index) {
        droppable.ref.current.style.opacity = "0.4";
      }
    });
  },
  onDragEnter: (sortSession2, overIndex, currentIndex) => {
    moveItemInArray(sortSession2.sortables, currentIndex, overIndex);
    const rects = sortSession2.sortables.map((s) => {
      var _a2;
      return (_a2 = droppables.get(s)) == null ? void 0 : _a2.rect;
    });
    sortSession2.sortables.forEach((sortable, index) => {
      if (!sortSession2)
        return;
      const newRects = moveItemInNewArray(
        rects,
        overIndex,
        sortSession2.activeIndex
      );
      const oldRect = rects[index];
      const newRect = newRects[index];
      const sortableTarget = droppables.get(sortable);
      if ((sortableTarget == null ? void 0 : sortableTarget.ref.current) && newRect && oldRect) {
        const x = newRect.left - oldRect.left;
        const y = newRect.top - oldRect.top;
        sortableTarget.ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    });
    sortSession2.finalIndex = overIndex;
  },
  onDragOver: () => {
  },
  onDragEnd: (sortSession2) => {
    sortSession2.sortables.forEach((sortable) => {
      const droppable = droppables.get(sortable);
      if (droppable == null ? void 0 : droppable.ref.current) {
        droppable.ref.current.style.transform = "";
        droppable.ref.current.style.transition = "";
        droppable.ref.current.style.opacity = "";
        droppable.ref.current.style.zIndex = "";
      }
    });
  }
};
const sortableMoveNodeStrategy = {
  onDragStart: () => {
  },
  onDragOver: () => {
  },
  onDragEnter: (sortSession2, overIndex, currentIndex) => {
    var _a2;
    const node = (_a2 = droppables.get(sortSession2.sortables[currentIndex])) == null ? void 0 : _a2.ref.current;
    if (node) {
      moveNode(node, currentIndex, overIndex);
      moveItemInArray(sortSession2.sortables, currentIndex, overIndex);
      sortSession2.finalIndex = overIndex;
    }
  },
  onDragEnd: () => {
  }
};
function moveNode(el, currentIndex, newIndex) {
  const parentEl = el.parentElement;
  if (newIndex < 0) {
    parentEl.prepend(el);
  } else {
    if (currentIndex > -1 && currentIndex <= newIndex) {
      newIndex++;
    }
    const ref = parentEl.children.item(newIndex);
    if (ref) {
      ref.before(el);
    } else {
      parentEl.append(el);
    }
  }
}
let sortSession = null;
const strategies = {
  line: sortableLineStrategy,
  liveSort: sortableTransformStrategy,
  moveNode: sortableMoveNodeStrategy
};
function useSortable({
  item,
  items,
  type,
  ref,
  onSortEnd,
  onSortStart,
  onDragEnd,
  preview,
  disabled,
  onDropPositionChange,
  strategy = "liveSort"
}) {
  useEffect(() => {
    if (sortSession && sortSession.sortables.length !== items.length) {
      sortSession.sortables = [...items];
      sortSession.activeIndex = items.indexOf(item);
    }
  }, [items, item]);
  const { draggableProps, dragHandleRef } = useDraggable({
    id: item,
    ref,
    type,
    preview,
    disabled,
    onDragStart: () => {
      var _a2;
      sortSession = {
        sortables: [...items],
        activeSortable: item,
        activeIndex: items.indexOf(item),
        finalIndex: items.indexOf(item),
        dropPosition: null,
        ref,
        scrollParent: ref.current ? getScrollParent(ref.current) : void 0,
        scrollListener: () => {
          updateRects(droppables);
        }
      };
      strategies[strategy].onDragStart(sortSession);
      onSortStart == null ? void 0 : onSortStart();
      (_a2 = sortSession.scrollParent) == null ? void 0 : _a2.addEventListener(
        "scroll",
        sortSession.scrollListener
      );
    },
    onDragEnd: () => {
      var _a2;
      if (!sortSession)
        return;
      sortSession.dropPosition = null;
      onDropPositionChange == null ? void 0 : onDropPositionChange(sortSession.dropPosition);
      if (sortSession.activeIndex !== sortSession.finalIndex) {
        onSortEnd == null ? void 0 : onSortEnd(sortSession.activeIndex, sortSession.finalIndex);
      }
      (_a2 = sortSession.scrollParent) == null ? void 0 : _a2.removeEventListener(
        "scroll",
        sortSession.scrollListener
      );
      strategies[strategy].onDragEnd(sortSession);
      onDragEnd == null ? void 0 : onDragEnd();
      sortSession = null;
    },
    getData: () => {
    }
  });
  const { droppableProps } = useDroppable({
    id: item,
    ref,
    types: [type],
    disabled,
    allowDragEventsFromItself: true,
    onDragOver: (target, e) => {
      if (!sortSession)
        return;
      strategies[strategy].onDragOver({
        e,
        ref,
        item,
        sortSession,
        onDropPositionChange
      });
    },
    onDragEnter: () => {
      if (!sortSession)
        return;
      const overIndex = sortSession.sortables.indexOf(item);
      const oldIndex = sortSession.sortables.indexOf(
        sortSession.activeSortable
      );
      strategies[strategy].onDragEnter(sortSession, overIndex, oldIndex);
    },
    onDragLeave: () => {
      if (!sortSession)
        return;
      sortSession.dropPosition = null;
      onDropPositionChange == null ? void 0 : onDropPositionChange(sortSession.dropPosition);
    }
  });
  return {
    sortableProps: { ...mergeProps(draggableProps, droppableProps) },
    dragHandleRef
  };
}
function MenuEditor() {
  const { menuIndex } = useParams();
  const navigate = useNavigate();
  const { getValues } = useFormContext();
  const formPath = `settings.menus.${menuIndex}`;
  const menu = getValues(formPath);
  useEffect(() => {
    if (!menu) {
      navigate("/admin/appearance/menus");
    } else {
      appearanceState().preview.setHighlight(`[data-menu-id="${menu.id}"]`);
    }
  }, [navigate, menu]);
  if (!menu) {
    return null;
  }
  return /* @__PURE__ */ jsx(MenuEditorSection, { formPath });
}
function MenuEditorSection({ formPath }) {
  const {
    site: { has_mobile_app }
  } = useSettings();
  const menuSectionConfig = useAppearanceStore(
    (s) => {
      var _a2;
      return (_a2 = s.config) == null ? void 0 : _a2.sections.menus.config;
    }
  );
  const menuPositions = useMemo(() => {
    const positions = [...menuSectionConfig == null ? void 0 : menuSectionConfig.positions];
    if (has_mobile_app) {
      positions.push("mobile-app-about");
    }
    return positions.map((position) => ({
      key: position,
      name: position.replaceAll("-", " ")
    }));
  }, [menuSectionConfig, has_mobile_app]);
  const fieldArray = useFieldArray({
    name: `${formPath}.items`,
    keyName: "key"
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-30 border-b pb-30", children: [
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          name: `${formPath}.name`,
          label: /* @__PURE__ */ jsx(Trans, { message: "Menu name" }),
          className: "mb-20",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsx(
        FormChipField,
        {
          chipSize: "sm",
          name: `${formPath}.positions`,
          valueKey: "id",
          label: /* @__PURE__ */ jsx(Trans, { message: "Menu positions" }),
          description: /* @__PURE__ */ jsx(Trans, { message: "Where should this menu appear on the site" }),
          children: menuPositions.map((item) => /* @__PURE__ */ jsx(Item, { value: item.key, capitalizeFirst: true, children: item.name }, item.key))
        }
      )
    ] }),
    /* @__PURE__ */ jsx(MenuItemsManager, { fieldArray }),
    /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(DeleteMenuTrigger, {}) })
  ] });
}
function MenuItemsManager({ fieldArray: { append, fields, move } }) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-shrink-0 items-center justify-between gap-16", children: [
      /* @__PURE__ */ jsx(Trans, { message: "Menu items" }),
      /* @__PURE__ */ jsxs(
        DialogTrigger,
        {
          type: "popover",
          placement: "right",
          offset: 20,
          onClose: (menuItemConfig) => {
            if (menuItemConfig) {
              append({ ...menuItemConfig });
              navigate(`items/${fields.length}`);
            }
          },
          children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                color: "primary",
                size: "xs",
                startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
                children: /* @__PURE__ */ jsx(Trans, { message: "Add" })
              }
            ),
            /* @__PURE__ */ jsx(AddMenuItemDialog, {})
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-20 flex-shrink-0", children: [
      fields.map((item, index) => /* @__PURE__ */ jsx(
        MenuListItem,
        {
          item,
          items: fields,
          index,
          onSortEnd: (oldIndex, newIndex) => {
            move(oldIndex, newIndex);
          }
        },
        item.key
      )),
      !fields.length ? /* @__PURE__ */ jsx(
        IllustratedMessage,
        {
          size: "xs",
          className: "my-40",
          image: /* @__PURE__ */ jsx(SvgImage, { src: dropdownMenu }),
          title: /* @__PURE__ */ jsx(Trans, { message: "No menu items yet" }),
          description: /* @__PURE__ */ jsx(Trans, { message: "Click “add“ button to start adding links, pages, routes and other items to this menu. " })
        }
      ) : null
    ] })
  ] });
}
function DeleteMenuTrigger() {
  const navigate = useNavigate();
  const { menuIndex } = useParams();
  const { fields, remove } = useFieldArray({
    name: "settings.menus",
    keyName: "key"
  });
  if (!menuIndex)
    return null;
  const menu = fields[+menuIndex];
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (isConfirmed) => {
        if (isConfirmed) {
          const index = fields.findIndex((m2) => m2.id === menu.id);
          remove(index);
          navigate("/admin/appearance/menus");
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            color: "danger",
            size: "xs",
            startIcon: /* @__PURE__ */ jsx(DeleteIcon, {}),
            children: /* @__PURE__ */ jsx(Trans, { message: "Delete menu" })
          }
        ),
        /* @__PURE__ */ jsx(
          ConfirmationDialog,
          {
            isDanger: true,
            title: /* @__PURE__ */ jsx(Trans, { message: "Delete menu" }),
            body: /* @__PURE__ */ jsx(
              Trans,
              {
                message: "Are you sure you want to delete “:name“?",
                values: { name: menu.name }
              }
            ),
            confirm: /* @__PURE__ */ jsx(Trans, { message: "Delete" })
          }
        )
      ]
    }
  );
}
function MenuListItem({ item, items, index, onSortEnd }) {
  const ref = useRef(null);
  const { sortableProps, dragHandleRef } = useSortable({
    item,
    items,
    type: "menuEditorSortable",
    ref,
    onSortEnd,
    strategy: "liveSort"
  });
  const Icon = item.icon && createSvgIconFromTree(item.icon);
  const iconOnlyLabel = /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs text-muted", children: [
    Icon && /* @__PURE__ */ jsx(Icon, { size: "sm" }),
    "(",
    /* @__PURE__ */ jsx(Trans, { message: "No label..." }),
    ")"
  ] });
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    AppearanceButton,
    {
      elementType: Link,
      to: `items/${index}`,
      ref,
      ...sortableProps,
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-10", children: [
        /* @__PURE__ */ jsx(IconButton, { ref: dragHandleRef, size: "sm", children: /* @__PURE__ */ jsx(DragIndicatorIcon, { className: "text-muted hover:cursor-move" }) }),
        /* @__PURE__ */ jsx("div", { children: item.label || iconOnlyLabel })
      ] })
    }
  ) });
}
function MenuItemEditor() {
  const { menuIndex, menuItemIndex } = useParams();
  const navigate = useNavigate$1();
  const { getValues } = useFormContext();
  const formPath = `settings.menus.${menuIndex}.items.${menuItemIndex}`;
  const item = getValues(formPath);
  useEffect(() => {
    if (!item)
      ;
    else {
      appearanceState().preview.setHighlight(
        `[data-menu-item-id="${item.id}"]`
      );
    }
  }, [navigate, item]);
  if (!item || menuItemIndex == null) {
    return null;
  }
  return /* @__PURE__ */ jsx(MenuItemEditorSection, { formPath });
}
function MenuItemEditorSection({ formPath }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(MenuItemForm, { formPathPrefix: formPath }),
    /* @__PURE__ */ jsx("div", { className: "text-right mt-40", children: /* @__PURE__ */ jsx(DeleteItemTrigger, {}) })
  ] });
}
function DeleteItemTrigger() {
  const navigate = useNavigate$1();
  const { menuIndex, menuItemIndex } = useParams();
  const { fields, remove } = useFieldArray({
    name: `settings.menus.${+menuIndex}.items`
  });
  if (!menuItemIndex)
    return null;
  const item = fields[+menuItemIndex];
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (isConfirmed) => {
        if (isConfirmed) {
          if (menuItemIndex) {
            remove(+menuItemIndex);
            navigate(`/admin/appearance/menus/${menuIndex}`);
          }
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            color: "danger",
            size: "xs",
            startIcon: /* @__PURE__ */ jsx(DeleteIcon, {}),
            children: /* @__PURE__ */ jsx(Trans, { message: "Delete this item" })
          }
        ),
        /* @__PURE__ */ jsx(
          ConfirmationDialog,
          {
            isDanger: true,
            title: /* @__PURE__ */ jsx(Trans, { message: "Delete menu item" }),
            body: /* @__PURE__ */ jsx(
              Trans,
              {
                message: "Are you sure you want to delete “:name“?",
                values: { name: item.label }
              }
            ),
            confirm: /* @__PURE__ */ jsx(Trans, { message: "Delete" })
          }
        )
      ]
    }
  );
}
function GeneralSection() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      BrandingImageSelector,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Favicon" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "This will generate different size favicons. Image should be at least 512x512 in size." }),
        type: "favicon"
      }
    ),
    /* @__PURE__ */ jsx(
      BrandingImageSelector,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Light logo" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Will be used on dark backgrounds." }),
        type: "logo_light"
      }
    ),
    /* @__PURE__ */ jsx(
      BrandingImageSelector,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Dark logo" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Will be used on light backgrounds. Will default to light logo if left empty." }),
        type: "logo_dark"
      }
    ),
    /* @__PURE__ */ jsx(
      BrandingImageSelector,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Mobile light logo" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Will be used on light backgrounds on mobile. Will default to desktop logo if left empty." }),
        type: "logo_light_mobile"
      }
    ),
    /* @__PURE__ */ jsx(
      BrandingImageSelector,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Mobile dark logo" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Will be used on dark backgrounds on mobile. Will default to desktop if left empty." }),
        type: "logo_dark_mobile"
      }
    ),
    /* @__PURE__ */ jsx(SiteNameTextField, {}),
    /* @__PURE__ */ jsx(SiteDescriptionTextArea, {})
  ] });
}
function BrandingImageSelector({ label, description, type }) {
  const defaultValue = useAppearanceStore(
    (s) => {
      var _a2;
      return (_a2 = s.defaults) == null ? void 0 : _a2.settings.branding[type];
    }
  );
  return /* @__PURE__ */ jsx(
    FormImageSelector,
    {
      name: `settings.branding.${type}`,
      className: "border-b pb-30 mb-30",
      label,
      description,
      diskPrefix: "branding_media",
      defaultValue,
      onChange: () => {
        appearanceState().preview.setHighlight('[data-logo="navbar"]');
      }
    }
  );
}
function SiteNameTextField() {
  return /* @__PURE__ */ jsx(
    FormTextField,
    {
      name: "appearance.env.app_name",
      required: true,
      className: "mt-20",
      label: /* @__PURE__ */ jsx(Trans, { message: "Site name" })
    }
  );
}
function SiteDescriptionTextArea() {
  return /* @__PURE__ */ jsx(
    FormTextField,
    {
      name: "settings.branding.site_description",
      className: "mt-20",
      inputElementType: "textarea",
      rows: 4,
      label: /* @__PURE__ */ jsx(Trans, { message: "Site description" })
    }
  );
}
function randomNumber(min = 1, max = 1e4) {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);
  const number = randomBuffer[0] / (4294967295 + 1);
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(number * (max - min + 1)) + min;
}
function ThemeList() {
  const { trans } = useTrans();
  const navigate = useNavigate();
  const {
    data: { themes }
  } = useBootstrapData();
  const { fields, append } = useFieldArray({
    name: "appearance.themes.all",
    keyName: "key"
  });
  useEffect(() => {
    if (themes.selectedThemeId) {
      appearanceState().preview.setActiveTheme(themes.selectedThemeId);
    }
  }, [themes.selectedThemeId]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-20", children: /* @__PURE__ */ jsx(
      Button,
      {
        size: "xs",
        variant: "outline",
        color: "primary",
        startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
        onClick: () => {
          var _a2;
          const lightThemeColors = (_a2 = appearanceState().defaults) == null ? void 0 : _a2.appearance.themes.light;
          append({
            id: randomNumber(),
            name: trans(message("New theme")),
            values: lightThemeColors
          });
          navigate(`${fields.length + 1}`);
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "New theme" })
      }
    ) }),
    fields.map((field, index) => /* @__PURE__ */ jsx(AppearanceButton, { to: `${index}`, elementType: NavLink, children: field.name }, field.key))
  ] });
}
const AceEditor = React.lazy(() => import("./ace-editor-75cf6080.mjs"));
function AceDialog({
  defaultValue,
  mode = "html",
  title,
  onSave,
  isSaving,
  footerStartAction,
  beautify,
  editorRef
}) {
  const [value, setValue] = useState(defaultValue);
  const [isValid, setIsValid] = useState(true);
  return /* @__PURE__ */ jsxs(Dialog, { size: "fullscreen", className: "h-full w-full", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: title }),
    /* @__PURE__ */ jsx(DialogBody, { className: "relative flex-auto", padding: "p-0", children: /* @__PURE__ */ jsx(
      Suspense,
      {
        fallback: /* @__PURE__ */ jsx("div", { className: "flex h-400 w-full items-center justify-center", children: /* @__PURE__ */ jsx(
          ProgressCircle,
          {
            "aria-label": "Loading editor...",
            isIndeterminate: true,
            size: "md"
          }
        ) }),
        children: /* @__PURE__ */ jsx(
          AceEditor,
          {
            beautify,
            mode,
            onChange: (newValue) => setValue(newValue),
            defaultValue: value || "",
            onIsValidChange: setIsValid,
            editorRef
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx(
      Footer,
      {
        disabled: !isValid || isSaving,
        value,
        onSave,
        startAction: footerStartAction
      }
    )
  ] });
}
function Footer({ disabled, value, onSave, startAction }) {
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsxs(DialogFooter, { dividerTop: true, startAction, children: [
    /* @__PURE__ */ jsx(Button, { onClick: () => close(), children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
    /* @__PURE__ */ jsx(
      Button,
      {
        disabled,
        variant: "flat",
        color: "primary",
        onClick: () => {
          if (onSave) {
            onSave(value);
          } else {
            close(value);
          }
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
      }
    )
  ] });
}
function useSeoTags(name) {
  return useQuery({
    queryKey: ["admin", "seo-tags", name],
    queryFn: () => fetchTags(name)
  });
}
function fetchTags(name) {
  return apiClient.get(`admin/appearance/seo-tags/${name}`).then((response) => response.data);
}
function useUpdateSeoTags(name) {
  const queryClient2 = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateTags(name, payload.tags),
    onSuccess: async () => {
      await queryClient2.invalidateQueries({
        queryKey: ["admin", "seo-tags", name]
      });
      toast(message("Updated SEO tags"));
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function updateTags(name, tags) {
  return apiClient.put(`admin/appearance/seo-tags/${name}`, { tags }).then((r) => r.data);
}
const pages = ((_a = mergedAppearanceConfig.sections["seo-settings"].config) == null ? void 0 : _a.pages) || [];
const names = pages.map((page) => page.key);
function SeoSection() {
  const { isLoading } = useSeoTags(names);
  if (isLoading) {
    return /* @__PURE__ */ jsx(FullPageLoader, {});
  }
  return /* @__PURE__ */ jsx(Fragment, { children: pages.map((page) => /* @__PURE__ */ jsx(TagEditorTrigger, { label: page.label, name: page.key }, page.key)) });
}
function TagEditorTrigger({ label, name }) {
  const { data, isLoading } = useSeoTags(names);
  return /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
    /* @__PURE__ */ jsx(AppearanceButton, { disabled: isLoading, children: /* @__PURE__ */ jsx(Trans, { ...label }) }),
    data ? /* @__PURE__ */ jsx(TagsEditorDialog, { name, value: data[name] }) : null
  ] });
}
function TagsEditorDialog({ name, value }) {
  const { close } = useDialogContext();
  const updateTags2 = useUpdateSeoTags(name);
  const editorRef = useRef(null);
  const resetButton = /* @__PURE__ */ jsx(
    Button,
    {
      variant: "outline",
      color: "primary",
      onClick: () => {
        if (editorRef.current) {
          editorRef.current.editor.setValue(value.original);
        }
      },
      children: /* @__PURE__ */ jsx(Trans, { message: "Reset to original" })
    }
  );
  return /* @__PURE__ */ jsx(
    AceDialog,
    {
      mode: "php_laravel_blade",
      title: /* @__PURE__ */ jsx(Trans, { message: "Edit SEO meta tags" }),
      footerStartAction: resetButton,
      editorRef,
      defaultValue: value.custom || value.original,
      isSaving: updateTags2.isPending,
      beautify: false,
      onSave: (newValue) => {
        if (newValue != null) {
          updateTags2.mutate(
            { tags: newValue },
            {
              onSuccess: () => close()
            }
          );
        }
      }
    }
  );
}
function CustomCodeSection() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(CustomCodeDialogTrigger, { mode: "css" }),
    /* @__PURE__ */ jsx(CustomCodeDialogTrigger, { mode: "html" })
  ] });
}
function CustomCodeDialogTrigger({ mode }) {
  const { getValues } = useFormContext();
  const { setValue } = useFormContext();
  const title = mode === "html" ? /* @__PURE__ */ jsx(Trans, { message: "Custom HTML & JavaScript" }) : /* @__PURE__ */ jsx(Trans, { message: "Custom CSS" });
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (newValue) => {
        if (newValue != null) {
          setValue(`appearance.custom_code.${mode}`, newValue, {
            shouldDirty: true
          });
          appearanceState().preview.setCustomCode(mode, newValue);
        }
      },
      children: [
        /* @__PURE__ */ jsx(AppearanceButton, { children: title }),
        /* @__PURE__ */ jsx(
          AceDialog,
          {
            title,
            defaultValue: getValues(`appearance.custom_code.${mode}`) || "",
            mode
          }
        )
      ]
    }
  );
}
const articlesSvg = "/assets/articles-8bfd9f17.svg";
const CustomPageDatatableFilters = (config) => {
  const dynamicFilters = config.customPages.types.length > 1 ? [
    {
      control: {
        type: FilterControlType.Select,
        defaultValue: "default",
        options: config.customPages.types.map((type) => ({
          value: type.type,
          label: type.label,
          key: type.type
        }))
      },
      key: "type",
      label: message("Type"),
      description: message("Type of the page"),
      defaultOperator: FilterOperator.eq
    }
  ] : [];
  return [
    {
      key: "user_id",
      label: message("User"),
      description: message("User page was created by"),
      defaultOperator: FilterOperator.eq,
      control: {
        type: FilterControlType.SelectModel,
        model: USER_MODEL
      }
    },
    ...dynamicFilters,
    createdAtFilter({
      description: message("Date page was created")
    }),
    updatedAtFilter({
      description: message("Date page was last updated")
    })
  ];
};
const CustomPageDatatableColumns = [
  {
    key: "slug",
    allowsSorting: true,
    width: "flex-2 min-w-200",
    visibleInMode: "all",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Slug" }),
    body: (page) => /* @__PURE__ */ jsx(Link, { target: "_blank", to: `/pages/${page.slug}`, className: LinkStyle, children: page.slug })
  },
  {
    key: "user_id",
    allowsSorting: true,
    width: "flex-2 min-w-140",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Owner" }),
    body: (page) => page.user && /* @__PURE__ */ jsx(
      NameWithAvatar,
      {
        image: page.user.avatar,
        label: page.user.display_name,
        description: page.user.email
      }
    )
  },
  {
    key: "type",
    maxWidth: "max-w-100",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Type" }),
    body: (page) => /* @__PURE__ */ jsx(Trans, { message: page.type })
  },
  {
    key: "updated_at",
    allowsSorting: true,
    width: "w-100",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Last updated" }),
    body: (page) => /* @__PURE__ */ jsx(FormattedDate, { date: page.updated_at })
  },
  {
    key: "actions",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    hideHeader: true,
    align: "end",
    width: "w-84 flex-shrink-0",
    visibleInMode: "all",
    body: (page) => /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "md",
        className: "text-muted",
        elementType: Link,
        to: `${page.id}/edit`,
        children: /* @__PURE__ */ jsx(EditIcon, {})
      }
    )
  }
];
function CustomPageDatablePage() {
  const config = useContext(SiteConfigContext);
  const filters = useMemo(() => {
    return CustomPageDatatableFilters(config);
  }, [config]);
  return /* @__PURE__ */ jsx(
    DataTablePage,
    {
      endpoint: "custom-pages",
      title: /* @__PURE__ */ jsx(Trans, { message: "Custom pages" }),
      filters,
      columns: CustomPageDatatableColumns,
      queryParams: { with: "user" },
      actions: /* @__PURE__ */ jsx(Actions$7, {}),
      selectedActions: /* @__PURE__ */ jsx(DeleteSelectedItemsAction, {}),
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: articlesSvg,
          title: /* @__PURE__ */ jsx(Trans, { message: "No pages have been created yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching pages" })
        }
      )
    }
  );
}
function Actions$7() {
  return /* @__PURE__ */ jsx(DataTableAddItemButton, { elementType: Link, to: "new", children: /* @__PURE__ */ jsx(Trans, { message: "New page" }) });
}
const AppSettingsNavConfig = [
  { label: message("Drive"), to: "drive" }
];
const filteredSettingsNavConfig = [
  { label: message("General"), to: "general" },
  ...AppSettingsNavConfig,
  getBootstrapData().settings.billing.integrated && {
    label: message("Subscriptions"),
    to: "subscriptions"
  },
  { label: message("Localization"), to: "localization" },
  {
    label: message("Authentication"),
    to: "authentication"
  },
  { label: message("Uploading"), to: "uploading" },
  { label: message("Outgoing email"), to: "outgoing-email" },
  { label: message("Cache"), to: "cache" },
  { label: message("Analytics"), to: "analytics" },
  { label: message("Logging"), to: "logging" },
  { label: message("Queue"), to: "queue" },
  { label: message("Recaptcha"), to: "recaptcha" },
  { label: message("GDPR"), to: "gdpr" },
  {
    label: message("Menus"),
    to: "/admin/appearance/menus"
  },
  {
    label: message("Seo"),
    to: "/admin/appearance/seo-settings"
  },
  {
    label: message("Themes"),
    to: "/admin/appearance/themes"
  }
].filter(Boolean);
const SettingsNavConfig = filteredSettingsNavConfig;
function SettingsLayout({ className }) {
  const isMobile = useIsMobileMediaQuery();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        className,
        "container mx-auto min-h-full items-start gap-30 p-24 md:flex"
      ),
      children: [
        /* @__PURE__ */ jsx(StaticPageTitle, { children: /* @__PURE__ */ jsx(Trans, { message: "Settings" }) }),
        isMobile ? /* @__PURE__ */ jsx(MobileNav, {}) : /* @__PURE__ */ jsx(DesktopNav, {}),
        /* @__PURE__ */ jsx("div", { className: "relative max-w-500 flex-auto md:px-30", children: /* @__PURE__ */ jsx(Outlet, {}) })
      ]
    }
  );
}
function MobileNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const value = pathname.split("/").pop();
  return /* @__PURE__ */ jsx(
    SelectForwardRef,
    {
      minWidth: "min-w-none",
      className: "mb-24 w-full bg",
      selectionMode: "single",
      selectedValue: value,
      onSelectionChange: (newPage) => {
        navigate(newPage);
      },
      children: SettingsNavConfig.map((item) => /* @__PURE__ */ jsx(Item, { value: item.to, children: /* @__PURE__ */ jsx(Trans, { ...item.label }) }, item.to))
    }
  );
}
function DesktopNav() {
  return /* @__PURE__ */ jsx("div", { className: "sticky top-24 w-240 flex-shrink-0", children: SettingsNavConfig.map((item) => /* @__PURE__ */ jsx(
    NavLink,
    {
      to: item.to,
      className: ({ isActive }) => clsx(
        "mb-8 block whitespace-nowrap rounded-button p-14 text-sm transition-bg-color",
        isActive ? "bg-primary/6 font-semibold text-primary" : "hover:bg-hover"
      ),
      children: /* @__PURE__ */ jsx(Trans, { ...item.label })
    },
    item.to
  )) });
}
function useAdminSettings() {
  return useQuery({
    queryKey: ["fetchAdminSettings"],
    queryFn: () => fetchAdminSettings(),
    // prevent automatic re-fetching so diffing with previous settings work properly
    staleTime: Infinity
  });
}
function fetchAdminSettings() {
  return apiClient.get("settings").then((response) => response.data);
}
function GenerateSitemap() {
  return apiClient.post("sitemap/generate").then((r) => r.data);
}
function useGenerateSitemap() {
  return useMutation({
    mutationFn: () => GenerateSitemap(),
    onSuccess: () => {
      toast(message("Sitemap generated"));
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function useUpdateAdminSettings(form) {
  const { data: original } = useAdminSettings();
  return useMutation({
    mutationFn: (props) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      if ((_b = (_a2 = props.client) == null ? void 0 : _a2.cookie_notice) == null ? void 0 : _b.button) {
        props.client.cookie_notice.button = JSON.stringify(
          props.client.cookie_notice.button
        );
      }
      if ((_d = (_c = props.client) == null ? void 0 : _c.registration) == null ? void 0 : _d.policies) {
        props.client.registration.policies = JSON.stringify(
          props.client.registration.policies
        );
      }
      if ((_f = (_e = props.client) == null ? void 0 : _e.artistPage) == null ? void 0 : _f.tabs) {
        props.client.artistPage.tabs = JSON.stringify(
          props.client.artistPage.tabs
        );
      }
      if ((_h = (_g = props.client) == null ? void 0 : _g.title_page) == null ? void 0 : _h.sections) {
        props.client.title_page.sections = JSON.stringify(
          props.client.title_page.sections
        );
      }
      if ((_i = props.client) == null ? void 0 : _i.incoming_email) {
        props.client.incoming_email = JSON.stringify(
          props.client.incoming_email
        );
      }
      if ((_k = (_j = props.client) == null ? void 0 : _j.publish) == null ? void 0 : _k.default_credentials) {
        props.client.publish.default_credentials = JSON.stringify(
          props.client.publish.default_credentials
        );
      }
      const client = props.client ? diff(original.client, props.client) : null;
      const server = props.server ? diff(original.server, props.server) : null;
      return updateAdminSettings({
        client,
        server,
        files: props.files
      });
    },
    onSuccess: () => {
      toast(message("Settings updated"), {
        position: "bottom-right"
      });
      queryClient.invalidateQueries({ queryKey: ["fetchAdminSettings"] });
    },
    onError: (r) => onFormQueryError(r, form)
  });
}
function updateAdminSettings({
  client,
  server,
  files
}) {
  const formData = new FormData();
  if (client) {
    formData.set("client", JSON.stringify(dot.dot(client)));
  }
  if (server) {
    formData.set("server", JSON.stringify(dot.dot(server)));
  }
  Object.entries(files || {}).forEach(([key, file]) => {
    formData.set(key, file);
  });
  return apiClient.post("settings", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }).then((r) => r.data);
}
function SettingsPanel({
  title,
  description,
  children,
  transformValues
}) {
  const { data } = useAdminSettings();
  return /* @__PURE__ */ jsxs("section", { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-40", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl", children: title }),
      /* @__PURE__ */ jsx("div", { className: "text-sm text-muted", children: description })
    ] }),
    data ? /* @__PURE__ */ jsx(FormWrapper, { defaultValues: data, transformValues, children }) : /* @__PURE__ */ jsx(ProgressCircle, { isIndeterminate: true, "aria-label": "Loading settings..." })
  ] });
}
function FormWrapper({
  children,
  defaultValues,
  transformValues
}) {
  const form = useForm({ defaultValues });
  const updateSettings = useUpdateAdminSettings(form);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Form$1,
      {
        form,
        onBeforeSubmit: () => {
          const errors = form.formState.errors;
          const keys = Object.keys(errors).filter((key) => {
            return key.endsWith("_group");
          });
          form.clearErrors(keys);
        },
        onSubmit: (value) => {
          value = transformValues ? transformValues(value) : value;
          updateSettings.mutate(value);
        },
        children: [
          children,
          /* @__PURE__ */ jsx("div", { className: "mt-40", children: /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              variant: "flat",
              color: "primary",
              disabled: updateSettings.isPending,
              children: /* @__PURE__ */ jsx(Trans, { message: "Update" })
            }
          ) })
        ]
      }
    ),
    updateSettings.isPending && /* @__PURE__ */ jsx(
      ProgressBar,
      {
        size: "xs",
        className: "absolute -bottom-14 left-30 w-full",
        isIndeterminate: true,
        "aria-label": "Saving settings..."
      }
    )
  ] });
}
function SettingsSeparator() {
  return /* @__PURE__ */ jsx("div", { className: "h-1 bg-divider my-30" });
}
function LearnMoreLink({ link, className }) {
  const { site } = useSettings();
  if (site.hide_docs_button) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center gap-8", className), children: [
    /* @__PURE__ */ jsx(LinkIcon, { size: "sm" }),
    /* @__PURE__ */ jsx(ExternalLink, { href: link, children: /* @__PURE__ */ jsx(Trans, { message: "Learn more" }) })
  ] });
}
function GeneralSettings() {
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "General" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Configure site url, homepage, theme and other general settings." }),
      children: [
        /* @__PURE__ */ jsx(SiteUrlSection, {}),
        /* @__PURE__ */ jsx(SettingsSeparator, {}),
        /* @__PURE__ */ jsx(HomepageSection, {}),
        /* @__PURE__ */ jsx(SettingsSeparator, {}),
        /* @__PURE__ */ jsx(ThemeSection, {}),
        /* @__PURE__ */ jsx(SettingsSeparator, {}),
        /* @__PURE__ */ jsx(SitemapSection, {})
      ]
    }
  );
}
function SiteUrlSection() {
  const { data } = useAdminSettings();
  if (!data)
    return null;
  let append = null;
  const server = data.server;
  const isInvalid = server.newAppUrl && server.newAppUrl !== server.app_url;
  if (isInvalid) {
    append = /* @__PURE__ */ jsx("div", { className: "mt-20 text-sm text-danger", children: /* @__PURE__ */ jsx(
      Trans,
      {
        values: {
          baseUrl: server.app_url,
          currentUrl: server.newAppUrl,
          b: (chunks) => /* @__PURE__ */ jsx("b", { children: chunks })
        },
        message: "Base site url is set as <b>:baseUrl</b> in configuration, but current url is <b>:currentUrl</b>. It is recommended to set the primary url you want to use in configuration file and then redirect all other url versions to this primary version via cpanel or .htaccess file."
      }
    ) });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: !!isInvalid,
        name: "server.app_url",
        label: /* @__PURE__ */ jsx(Trans, { message: "Primary site url" }),
        description: /* @__PURE__ */ jsx(LearnMoreLink, { link: "https://support.vebto.com/help-center/articles/35/primary-site-url" })
      }
    ),
    append
  ] });
}
function HomepageSection() {
  var _a2, _b;
  const { watch } = useFormContext();
  const { homepage } = useContext(SiteConfigContext);
  const { data } = useValueLists(["menuItemCategories"]);
  const selectedType = watch("client.homepage.type");
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      FormSelect,
      {
        name: "client.homepage.type",
        selectionMode: "single",
        label: /* @__PURE__ */ jsx(Trans, { message: "Site home page" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Which page should be used as site homepage." }),
        children: [
          homepage.options.map((option) => /* @__PURE__ */ jsx(Item, { value: option.value, children: /* @__PURE__ */ jsx(Trans, { ...option.label }) }, option.value)),
          (_a2 = data == null ? void 0 : data.menuItemCategories) == null ? void 0 : _a2.map((category) => /* @__PURE__ */ jsx(Item, { value: category.type, children: category.name }, category.type))
        ]
      }
    ),
    (_b = data == null ? void 0 : data.menuItemCategories) == null ? void 0 : _b.map((category) => {
      return selectedType === category.type ? /* @__PURE__ */ jsx(
        FormSelect,
        {
          className: "mt-24",
          name: "client.homepage.value",
          selectionMode: "single",
          label: /* @__PURE__ */ jsx(Trans, { message: "Homepage :name", values: { name: category.name } }),
          children: category.items.map((item) => /* @__PURE__ */ jsx(Item, { value: item.model_id, children: item.label }, item.label))
        },
        category.name
      ) : null;
    })
  ] });
}
function ThemeSection() {
  const {
    data: { themes }
  } = useBootstrapData();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      FormSelect,
      {
        className: "mb-20",
        name: "client.themes.default_id",
        selectionMode: "single",
        label: /* @__PURE__ */ jsx(Trans, { message: "Default site theme" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Which theme to use for users that have not chosen a theme manually." }),
        children: [
          /* @__PURE__ */ jsx(Item, { value: 0, children: /* @__PURE__ */ jsx(Trans, { message: "System" }) }),
          themes.all.map((theme) => /* @__PURE__ */ jsx(Item, { value: theme.id, children: theme.name }, theme.id))
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        name: "client.themes.user_change",
        description: /* @__PURE__ */ jsx(Trans, { message: "Allow users to manually change site theme." }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Allow theme change" })
      }
    )
  ] });
}
function SitemapSection() {
  const generateSitemap = useGenerateSitemap();
  const { base_url } = useSettings();
  const url = `${base_url}/storage/sitemaps/sitemap-index.xml`;
  const link = /* @__PURE__ */ jsx(ExternalLink, { href: url, children: url });
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        size: "xs",
        color: "primary",
        disabled: generateSitemap.isPending,
        onClick: () => {
          generateSitemap.mutate();
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Generate sitemap" })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mt-14 text-sm text-muted", children: /* @__PURE__ */ jsx(
      Trans,
      {
        message: "Once generated, sitemap url will be: :url",
        values: {
          url: link
        }
      }
    ) })
  ] });
}
function colorToThemeValue(color) {
  return parseColor(color).toString("rgb").replace("rgb(", "").replace(")", "").replace(/, ?/g, " ");
}
const TuneIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" }),
  "TuneOutlined"
);
function ThemeSettingsDialogTrigger() {
  const { getValues, setValue } = useFormContext();
  const { themeIndex } = useParams();
  const theme = getValues(`appearance.themes.all.${+themeIndex}`);
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (value) => {
        if (!value)
          return;
        getValues("appearance.themes.all").forEach((currentTheme, index) => {
          if (currentTheme.id === value.id) {
            setValue(`appearance.themes.all.${index}`, value, {
              shouldDirty: true
            });
            return;
          }
          if (value.default_light) {
            setValue(
              `appearance.themes.all.${index}`,
              { ...currentTheme, default_light: false },
              { shouldDirty: true }
            );
            return;
          }
          if (value.default_dark) {
            setValue(
              `appearance.themes.all.${index}`,
              { ...currentTheme, default_dark: false },
              { shouldDirty: true }
            );
            return;
          }
        });
      },
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "xs",
            variant: "outline",
            color: "primary",
            startIcon: /* @__PURE__ */ jsx(TuneIcon, {}),
            children: /* @__PURE__ */ jsx(Trans, { message: "Settings" })
          }
        ),
        /* @__PURE__ */ jsx(SettingsDialog, { theme })
      ]
    }
  );
}
function SettingsDialog({ theme }) {
  const form = useForm({ defaultValues: theme });
  const { close, formId } = useDialogContext();
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "default_light" && value.default_light) {
        form.setValue("default_dark", false);
      }
      if (name === "default_dark" && value.default_dark) {
        form.setValue("default_light", false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Update settings" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsxs(
      Form$1,
      {
        form,
        id: formId,
        onSubmit: (values) => {
          close(values);
        },
        children: [
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              name: "name",
              label: /* @__PURE__ */ jsx(Trans, { message: "Name" }),
              className: "mb-30",
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsx(
            FormSwitch,
            {
              name: "is_dark",
              className: "mb-20 pb-20 border-b",
              description: /* @__PURE__ */ jsx(Trans, { message: "Whether this theme has light text on dark background." }),
              children: /* @__PURE__ */ jsx(Trans, { message: "Dark theme" })
            }
          ),
          /* @__PURE__ */ jsx(
            FormSwitch,
            {
              name: "default_light",
              className: "mb-30",
              description: /* @__PURE__ */ jsx(Trans, { message: "When light mode is selected, this theme will be used." }),
              children: /* @__PURE__ */ jsx(Trans, { message: "Default for light mode" })
            }
          ),
          /* @__PURE__ */ jsx(
            FormSwitch,
            {
              name: "default_dark",
              description: /* @__PURE__ */ jsx(Trans, { message: "When dark mode is selected, this theme will be used." }),
              children: /* @__PURE__ */ jsx(Trans, { message: "Default for dark mode" })
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            close();
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          type: "submit",
          form: formId,
          disabled: !form.formState.isDirty,
          children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
        }
      )
    ] })
  ] });
}
const RestartAltIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M6 13c0-1.65.67-3.15 1.76-4.24L6.34 7.34C4.9 8.79 4 10.79 4 13c0 4.08 3.05 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91zm14 0c0-4.42-3.58-8-8-8-.06 0-.12.01-.18.01l1.09-1.09L11.5 2.5 8 6l3.5 3.5 1.41-1.41-1.08-1.08c.06 0 .12-.01.17-.01 3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93z" }),
  "RestartAltOutlined"
);
function ThemeMoreOptionsButton() {
  const navigate = useNavigate$1();
  const { themeIndex } = useParams();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { setValue, getValues } = useFormContext();
  const { fields, remove } = useFieldArray({
    name: "appearance.themes.all"
  });
  const deleteTheme = () => {
    if (fields.length <= 1) {
      toast.danger(message("At least one theme is required"));
      return;
    }
    if (themeIndex) {
      navigate("/admin/appearance/themes");
      remove(+themeIndex);
      setValue("appearance.themes.selectedThemeId", null);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      MenuTrigger,
      {
        onItemSelected: (key) => {
          if (key === "delete") {
            setConfirmDialogOpen(true);
          } else if (key === "reset") {
            const path = `appearance.themes.all.${+themeIndex}`;
            const defaultColors = getValues(`${path}.is_dark`) ? appearanceState().defaults.appearance.themes.dark : appearanceState().defaults.appearance.themes.light;
            Object.entries(defaultColors).forEach(([colorName, themeValue]) => {
              appearanceState().preview.setThemeValue(colorName, themeValue);
            });
            appearanceState().preview.setThemeFont(null);
            setValue(`${path}.values`, defaultColors, {
              shouldDirty: true
            });
            setValue(`${path}.font`, void 0, {
              shouldDirty: true
            });
          }
        },
        children: [
          /* @__PURE__ */ jsx(IconButton, { size: "md", className: "text-muted", children: /* @__PURE__ */ jsx(MoreVertIcon, {}) }),
          /* @__PURE__ */ jsxs(Menu, { children: [
            /* @__PURE__ */ jsx(Item, { value: "reset", startIcon: /* @__PURE__ */ jsx(RestartAltIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Reset colors" }) }),
            /* @__PURE__ */ jsx(Item, { value: "delete", startIcon: /* @__PURE__ */ jsx(DeleteIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Delete" }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      DialogTrigger,
      {
        type: "modal",
        isOpen: confirmDialogOpen,
        onClose: (isConfirmed) => {
          if (isConfirmed) {
            deleteTheme();
          }
          setConfirmDialogOpen(false);
        },
        children: /* @__PURE__ */ jsx(
          ConfirmationDialog,
          {
            isDanger: true,
            title: /* @__PURE__ */ jsx(Trans, { message: "Delete theme" }),
            body: /* @__PURE__ */ jsx(Trans, { message: "Are you sure you want to delete this theme?" }),
            confirm: /* @__PURE__ */ jsx(Trans, { message: "Delete" })
          }
        )
      }
    )
  ] });
}
const navbarColorMap = [
  {
    label: message("Accent"),
    value: "primary",
    bgColor: "bg-primary",
    previewBgColor: "text-primary"
  },
  {
    label: message("Background"),
    value: "bg",
    bgColor: "bg-background",
    previewBgColor: "text-background"
  },
  {
    label: message("Background alt"),
    value: "bg-alt",
    bgColor: "bg-alt",
    previewBgColor: "text-background-alt"
  },
  {
    label: message("Transparent"),
    value: "transparent",
    bgColor: "bg-transparent",
    previewBgColor: "text-transparent"
  }
];
function NavbarColorPicker() {
  var _a2;
  const { themeIndex } = useParams();
  const { watch, setValue } = useFormContext();
  const key = `appearance.themes.all.${themeIndex}.values.--be-navbar-color`;
  const selectedValue = watch(key);
  const previewColor = (_a2 = navbarColorMap.find(({ value }) => value === selectedValue)) == null ? void 0 : _a2.previewBgColor;
  return /* @__PURE__ */ jsxs(
    MenuTrigger,
    {
      placement: "right",
      selectionMode: "single",
      selectedValue,
      onSelectionChange: (value) => {
        setValue(key, value, { shouldDirty: true });
      },
      children: [
        /* @__PURE__ */ jsx(
          AppearanceButton,
          {
            startIcon: /* @__PURE__ */ jsx(
              ColorIcon,
              {
                viewBox: "0 0 48 48",
                className: clsx("icon-lg", previewColor)
              }
            ),
            children: /* @__PURE__ */ jsx(Trans, { message: "Navbar" })
          }
        ),
        /* @__PURE__ */ jsx(Menu, { children: navbarColorMap.map(({ label, value, bgColor }) => /* @__PURE__ */ jsx(
          Item,
          {
            value,
            startIcon: /* @__PURE__ */ jsx("div", { className: clsx("h-20 w-20 rounded border", bgColor) }),
            children: /* @__PURE__ */ jsx(Trans, { ...label })
          },
          value
        )) })
      ]
    }
  );
}
function themeValueToHex(value) {
  try {
    return parseColor(`rgb(${value.split(" ").join(",")})`).toString("hex");
  } catch (e) {
    return value;
  }
}
const colorList = [
  {
    label: message("Background"),
    key: "--be-background"
  },
  {
    label: message("Background alt"),
    key: "--be-background-alt"
  },
  {
    label: message("Foreground"),
    key: "--be-foreground-base"
  },
  {
    label: message("Accent light"),
    key: "--be-primary-light"
  },
  {
    label: message("Accent"),
    key: "--be-primary"
  },
  {
    label: message("Accent dark"),
    key: "--be-primary-dark"
  },
  {
    label: message("Text on accent"),
    key: "--be-on-primary"
  },
  {
    label: message("Chip"),
    key: "--be-background-chip"
  }
];
function ThemeEditor() {
  const navigate = useNavigate();
  const { themeIndex } = useParams();
  const { getValues, watch } = useFormContext();
  const theme = getValues(`appearance.themes.all.${+themeIndex}`);
  const selectedFont = watch(
    `appearance.themes.all.${+themeIndex}.font.family`
  );
  useEffect(() => {
    if (!theme) {
      navigate("/admin/appearance/themes");
    }
  }, [navigate, theme]);
  useEffect(() => {
    if (theme == null ? void 0 : theme.id) {
      appearanceState().preview.setActiveTheme(theme.id);
    }
  }, [theme == null ? void 0 : theme.id]);
  if (!theme)
    return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-20 flex items-center justify-between gap-10", children: [
      /* @__PURE__ */ jsx(ThemeSettingsDialogTrigger, {}),
      /* @__PURE__ */ jsx(ThemeMoreOptionsButton, {})
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        AppearanceButton,
        {
          elementType: Link,
          to: "font",
          description: selectedFont ? selectedFont : /* @__PURE__ */ jsx(Trans, { message: "System" }),
          children: /* @__PURE__ */ jsx(Trans, { message: "Font" })
        }
      ),
      /* @__PURE__ */ jsx(AppearanceButton, { elementType: Link, to: "radius", children: /* @__PURE__ */ jsx(Trans, { message: "Rounding" }) }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 mt-22 text-sm font-semibold", children: /* @__PURE__ */ jsx(Trans, { message: "Colors" }) }),
      /* @__PURE__ */ jsx(NavbarColorPicker, {}),
      colorList.map((color) => /* @__PURE__ */ jsx(
        ColorPickerTrigger,
        {
          colorName: color.key,
          label: /* @__PURE__ */ jsx(Trans, { ...color.label }),
          initialThemeValue: theme.values[color.key],
          theme
        },
        color.key
      ))
    ] })
  ] });
}
function ColorPickerTrigger({
  label,
  theme,
  colorName,
  initialThemeValue
}) {
  const { setValue } = useFormContext();
  const { themeIndex } = useParams();
  const [selectedThemeValue, setSelectedThemeValue] = useState(initialThemeValue);
  const selectThemeValue = (themeValue) => {
    setSelectedThemeValue(themeValue);
    appearanceState().preview.setThemeValue(colorName, themeValue);
  };
  useEffect(() => {
    setSelectedThemeValue(initialThemeValue);
  }, [initialThemeValue]);
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      value: themeValueToHex(selectedThemeValue),
      type: "popover",
      placement: "right",
      offset: 10,
      onValueChange: (newColor) => {
        selectThemeValue(colorToThemeValue(newColor));
      },
      onClose: (newColor, { valueChanged, initialValue }) => {
        if (newColor && valueChanged) {
          setValue(
            `appearance.themes.all.${+themeIndex}.values.${colorName}`,
            colorToThemeValue(newColor),
            { shouldDirty: true }
          );
          setValue("appearance.themes.selectedThemeId", theme.id);
        } else {
          selectThemeValue(initialValue);
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          AppearanceButton,
          {
            className: "capitalize",
            startIcon: /* @__PURE__ */ jsx(
              ColorIcon,
              {
                viewBox: "0 0 48 48",
                className: "icon-lg",
                style: { fill: `rgb(${selectedThemeValue})` }
              }
            ),
            children: label
          }
        ),
        /* @__PURE__ */ jsx(ColorPickerDialog, {})
      ]
    }
  );
}
function DriveSettings() {
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Drive" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Configure defaults for drive user dashboard." }),
      children: [
        /* @__PURE__ */ jsxs(
          FormRadioGroup,
          {
            required: true,
            className: "mb-30",
            size: "md",
            name: "client.drive.default_view",
            orientation: "vertical",
            label: /* @__PURE__ */ jsx(Trans, { message: "Default view mode" }),
            description: /* @__PURE__ */ jsx(Trans, { message: "Which view mode should user drive use by default." }),
            children: [
              /* @__PURE__ */ jsx(FormRadio, { value: "list", children: /* @__PURE__ */ jsx(Trans, { message: "List" }) }),
              /* @__PURE__ */ jsx(FormRadio, { value: "grid", children: /* @__PURE__ */ jsx(Trans, { message: "Grid" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            className: "mb-30",
            name: "client.drive.send_share_notification",
            description: /* @__PURE__ */ jsx(Trans, { message: "Send a notification to user when a file or folder is shared with them." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Share notifications" })
          }
        ),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            name: "client.share.suggest_emails",
            description: /* @__PURE__ */ jsx(Trans, { message: "Suggest email address of existing users when sharing a file or folder." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Suggest emails" })
          }
        )
      ]
    }
  );
}
const AppSettingsRoutes = [
  { path: "drive", element: /* @__PURE__ */ jsx(DriveSettings, {}) }
];
function SettingsErrorGroup({
  children,
  name,
  separatorBottom = true,
  separatorTop = true
}) {
  const {
    formState: { errors }
  } = useFormContext();
  const ref = useRef(null);
  const error = errors[name];
  useEffect(() => {
    var _a2;
    if (error) {
      (_a2 = ref.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
    }
  }, [error]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        separatorBottom && "border-b mb-20 pb-20",
        separatorTop && "border-t mt-20 pt-20",
        error && "border-y-error"
      ),
      ref,
      children: [
        children(!!error),
        error && /* @__PURE__ */ jsx(
          "div",
          {
            className: "text-danger text-sm mt-20",
            dangerouslySetInnerHTML: { __html: error.message }
          }
        )
      ]
    }
  );
}
function JsonChipField({ children, ...props }) {
  const {
    field: { onChange, onBlur, value = [], ref },
    fieldState: { invalid, error }
  } = useController({
    name: props.name
  });
  const arrayValue = useMemo(() => {
    const mixedValue = value;
    return typeof mixedValue === "string" ? JSON.parse(mixedValue) : mixedValue;
  }, [value]);
  const formProps = {
    onChange: (newValue) => {
      const jsonValue = JSON.stringify(newValue.map((chip) => chip.name));
      onChange(jsonValue);
    },
    onBlur,
    value: arrayValue,
    invalid,
    errorMessage: error == null ? void 0 : error.message
  };
  return /* @__PURE__ */ jsx(ChipField, { ref, ...mergeProps(formProps, props) });
}
const TabContext = React.createContext(null);
function Tabs(props) {
  const {
    size = "md",
    children,
    className,
    isLazy,
    overflow = "overflow-hidden"
  } = props;
  const tabsRef = useRef([]);
  const id = useId();
  const [selectedTab, setSelectedTab] = useControlledState(
    props.selectedTab,
    props.defaultSelectedTab || 0,
    props.onTabChange
  );
  const ContextValue = useMemo(() => {
    return {
      selectedTab,
      setSelectedTab,
      tabsRef,
      size,
      isLazy,
      id
    };
  }, [selectedTab, id, isLazy, setSelectedTab, size]);
  return /* @__PURE__ */ jsx(TabContext.Provider, { value: ContextValue, children: /* @__PURE__ */ jsx("div", { className: clsx(className, overflow, "max-w-full"), children }) });
}
function TabLine() {
  const { tabsRef, selectedTab } = useContext(TabContext);
  const [style, setStyle] = useState({
    width: void 0,
    transform: void 0,
    className: void 0
  });
  useLayoutEffect(() => {
    if (selectedTab != null && tabsRef.current) {
      const el = tabsRef.current[selectedTab];
      if (!el)
        return;
      setStyle((prevState) => {
        return {
          width: `${el.offsetWidth}px`,
          transform: `translateX(${el.offsetLeft}px)`,
          // disable initial transition for tabline
          className: prevState.width === void 0 ? "" : "transition-all"
        };
      });
    }
  }, [setStyle, selectedTab, tabsRef]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "absolute bottom-0 left-0 h-2 bg-primary",
        style.className
      ),
      role: "presentation",
      style: { width: style.width, transform: style.transform }
    }
  );
}
function TabList({ children, center, expand, className }) {
  const childrenArray = Children.toArray(children);
  return /* @__PURE__ */ jsx(FocusScope, { children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        // hide scrollbar completely on mobile, show compact one on desktop
        "flex relative max-w-full overflow-auto border-b max-sm:hidden-scrollbar md:compact-scrollbar",
        className
      ),
      role: "tablist",
      "aria-orientation": "horizontal",
      children: [
        childrenArray.map((child, index) => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              index,
              className: clsx(
                child.props.className,
                expand && "flex-auto",
                center && index === 0 && "ml-auto",
                center && index === childrenArray.length - 1 && "mr-auto"
              )
            });
          }
          return null;
        }),
        /* @__PURE__ */ jsx(TabLine, {})
      ]
    }
  ) });
}
function Tab({
  index,
  className,
  isDisabled,
  children,
  padding: paddingProp,
  elementType = "button",
  to,
  relative,
  width = "min-w-min"
}) {
  const {
    selectedTab,
    setSelectedTab,
    tabsRef,
    size = "md",
    id
  } = useContext(TabContext);
  const isSelected = index === selectedTab;
  const focusManager = useFocusManager();
  const padding = paddingProp || (size === "sm" ? "px-12" : "px-18");
  const mergedClassname = clsx(
    "tracking-wide overflow-hidden capitalize text-sm flex items-center justify-center outline-none transition-colors",
    "focus-visible:ring focus-visible:ring-2 ring-inset rounded whitespace-nowrap cursor-pointer",
    width,
    textColor({ isDisabled, isSelected }),
    className,
    size === "md" && `${padding} h-48`,
    size === "sm" && `${padding} h-32`,
    isDisabled && "pointer-events-none"
  );
  const onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        focusManager == null ? void 0 : focusManager.focusPrevious();
        break;
      case "ArrowRight":
        focusManager == null ? void 0 : focusManager.focusNext();
        break;
      case "Home":
        focusManager == null ? void 0 : focusManager.focusFirst();
        break;
      case "End":
        focusManager == null ? void 0 : focusManager.focusLast();
        break;
    }
  };
  const tabIndex = isSelected ? 0 : -1;
  const Element = elementType;
  return /* @__PURE__ */ jsx(
    Element,
    {
      disabled: isDisabled,
      id: `${id}-${index}-tab`,
      "aria-controls": `${id}-${index}-tabpanel`,
      type: "button",
      role: "tab",
      "aria-selected": isSelected,
      tabIndex: isDisabled ? void 0 : tabIndex,
      onKeyDown,
      onClick: () => {
        setSelectedTab(index);
      },
      to,
      relative,
      className: mergedClassname,
      ref: (el) => {
        if (tabsRef.current && el) {
          tabsRef.current[index] = el;
        }
      },
      children
    }
  );
}
function textColor({ isDisabled, isSelected }) {
  if (isDisabled) {
    return "text-disabled cursor-default";
  }
  if (isSelected) {
    return "text-primary";
  }
  return "text-muted hover:text-main";
}
function TabPanels({ children, className }) {
  const { selectedTab, isLazy } = useContext(TabContext);
  const panelArray = Children.toArray(children).filter((p) => !!p);
  let rendered;
  if (isLazy) {
    const el = panelArray[selectedTab];
    rendered = isValidElement(el) ? cloneElement(panelArray[selectedTab], {
      index: selectedTab
    }) : null;
  } else {
    rendered = panelArray.map((panel, index) => {
      if (isValidElement(panel)) {
        const isSelected = index === selectedTab;
        return cloneElement(panel, {
          index,
          "aria-hidden": !isSelected,
          className: !isSelected ? clsx(panel.props.className, "hidden") : panel.props.className
        });
      }
      return null;
    });
  }
  return /* @__PURE__ */ jsx("div", { className, children: rendered });
}
function TabPanel({
  className,
  children,
  index,
  ...domProps
}) {
  const { id } = useContext(TabContext);
  const [tabIndex, setTabIndex] = useState(0);
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref == null ? void 0 : ref.current) {
      const update = () => {
        const walker = getFocusableTreeWalker(ref.current, { tabbable: true });
        setTabIndex(walker.nextNode() ? void 0 : 0);
      };
      update();
      const observer = new MutationObserver(update);
      observer.observe(ref.current, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["tabIndex", "disabled"]
      });
      return () => {
        observer.disconnect();
      };
    }
  }, [ref]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      tabIndex,
      ref,
      id: `${id}-${index}-tabpanel`,
      "aria-labelledby": `${id}-${index}-tab`,
      className: clsx(className, "focus-visible:outline-primary-light"),
      role: "tabpanel",
      ...domProps,
      children
    }
  );
}
function SubscriptionSettings() {
  const { trans } = useTrans();
  return /* @__PURE__ */ jsx(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Subscriptions" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Configure gateway integration, accepted cards, invoices and other related settings." }),
      children: /* @__PURE__ */ jsxs(Tabs, { children: [
        /* @__PURE__ */ jsxs(TabList, { children: [
          /* @__PURE__ */ jsx(Tab, { children: /* @__PURE__ */ jsx(Trans, { message: "General" }) }),
          /* @__PURE__ */ jsx(Tab, { children: /* @__PURE__ */ jsx(Trans, { message: "Invoices" }) })
        ] }),
        /* @__PURE__ */ jsxs(TabPanels, { className: "pt-30", children: [
          /* @__PURE__ */ jsxs(TabPanel, { children: [
            /* @__PURE__ */ jsx(
              FormSwitch,
              {
                name: "client.billing.enable",
                description: /* @__PURE__ */ jsx(Trans, { message: "Enable or disable all subscription related functionality across the site." }),
                children: /* @__PURE__ */ jsx(Trans, { message: "Enable subscriptions" })
              }
            ),
            /* @__PURE__ */ jsx(SettingsSeparator, {}),
            /* @__PURE__ */ jsx(PaypalSection, {}),
            /* @__PURE__ */ jsx(StripeSection, {}),
            /* @__PURE__ */ jsx(SettingsSeparator, {}),
            /* @__PURE__ */ jsx(
              JsonChipField,
              {
                label: /* @__PURE__ */ jsx(Trans, { message: "Accepted cards" }),
                name: "client.billing.accepted_cards",
                placeholder: trans({ message: "Add new card..." })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(TabPanel, { children: [
            /* @__PURE__ */ jsx(
              FormTextField,
              {
                inputElementType: "textarea",
                rows: 5,
                label: /* @__PURE__ */ jsx(Trans, { message: "Invoice address" }),
                name: "client.billing.invoice.address",
                className: "mb-30"
              }
            ),
            /* @__PURE__ */ jsx(
              FormTextField,
              {
                inputElementType: "textarea",
                rows: 5,
                label: /* @__PURE__ */ jsx(Trans, { message: "Invoice notes" }),
                description: /* @__PURE__ */ jsx(Trans, { message: "Default notes to show under `notes` section of user invoice. Optional." }),
                name: "client.billing.invoice.notes"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function PaypalSection() {
  const { watch } = useFormContext();
  const paypalIsEnabled = watch("client.billing.paypal.enable");
  return /* @__PURE__ */ jsxs("div", { className: "mb-30", children: [
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        name: "client.billing.paypal.enable",
        description: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Trans, { message: "Enable PayPal payment gateway integration." }),
          /* @__PURE__ */ jsx(
            LearnMoreLink,
            {
              className: "mt-6",
              link: "https://support.vebto.com/help-center/articles/147/configuring-paypal"
            }
          )
        ] }),
        children: /* @__PURE__ */ jsx(Trans, { message: "PayPal gateway" })
      }
    ),
    paypalIsEnabled ? /* @__PURE__ */ jsx(SettingsErrorGroup, { name: "paypal_group", children: (isInvalid) => /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          name: "server.paypal_client_id",
          label: /* @__PURE__ */ jsx(Trans, { message: "PayPal Client ID" }),
          required: true,
          invalid: isInvalid,
          className: "mb-20"
        }
      ),
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          name: "server.paypal_secret",
          label: /* @__PURE__ */ jsx(Trans, { message: "PayPal Secret" }),
          required: true,
          invalid: isInvalid,
          className: "mb-20"
        }
      ),
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          name: "server.paypal_webhook_id",
          label: /* @__PURE__ */ jsx(Trans, { message: "PayPal Webhook ID" }),
          required: true,
          invalid: isInvalid,
          className: "mb-20"
        }
      ),
      /* @__PURE__ */ jsx(
        FormSwitch,
        {
          name: "client.billing.paypal_test_mode",
          invalid: isInvalid,
          description: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Trans, { message: "Allows testing PayPal payments with sandbox accounts." }) }),
          children: /* @__PURE__ */ jsx(Trans, { message: "PayPal test mode" })
        }
      )
    ] }) }) : null
  ] });
}
function StripeSection() {
  const { watch } = useFormContext();
  const stripeEnabled = watch("client.billing.stripe.enable");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        name: "client.billing.stripe.enable",
        description: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Trans, { message: "Enable Stripe payment gateway integration." }),
          /* @__PURE__ */ jsx(
            LearnMoreLink,
            {
              className: "mt-6",
              link: "https://support.vebto.com/help-center/articles/148/configuring-stripe"
            }
          )
        ] }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Stripe gateway" })
      }
    ),
    stripeEnabled ? /* @__PURE__ */ jsx(SettingsErrorGroup, { name: "stripe_group", separatorBottom: false, children: (isInvalid) => /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          name: "server.stripe_key",
          label: /* @__PURE__ */ jsx(Trans, { message: "Stripe publishable key" }),
          required: true,
          className: "mb-20",
          invalid: isInvalid
        }
      ),
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          name: "server.stripe_secret",
          label: /* @__PURE__ */ jsx(Trans, { message: "Stripe secret key" }),
          required: true,
          className: "mb-20",
          invalid: isInvalid
        }
      ),
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          name: "server.stripe_webhook_secret",
          label: /* @__PURE__ */ jsx(Trans, { message: "Stripe webhook signing secret" }),
          className: "mb-20",
          invalid: isInvalid
        }
      )
    ] }) }) : null
  ] });
}
function LocalizationSettings() {
  const { data } = useValueLists(["timezones", "localizations"]);
  const today = useCurrentDateTime();
  const { trans } = useTrans();
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Localization" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Configure global date, time and language settings." }),
      children: [
        /* @__PURE__ */ jsxs(
          FormSelect,
          {
            className: "mb-30",
            required: true,
            name: "client.dates.default_timezone",
            showSearchField: true,
            selectionMode: "single",
            label: /* @__PURE__ */ jsx(Trans, { message: "Default timezone" }),
            searchPlaceholder: trans(message("Search timezones")),
            description: /* @__PURE__ */ jsx(Trans, { message: "Which timezone should be selected by default for new users and guests." }),
            children: [
              /* @__PURE__ */ jsx(Item, { value: "auto", children: /* @__PURE__ */ jsx(Trans, { message: "Auto" }) }, "auto"),
              Object.entries((data == null ? void 0 : data.timezones) || {}).map(([groupName, timezones]) => /* @__PURE__ */ jsx(Section, { label: groupName, children: timezones.map((timezone) => /* @__PURE__ */ jsx(Item, { value: timezone.value, children: timezone.text }, timezone.value)) }, groupName))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          FormSelect,
          {
            name: "client.locale.default",
            className: "mb-30",
            selectionMode: "single",
            label: /* @__PURE__ */ jsx(Trans, { message: "Default language" }),
            description: /* @__PURE__ */ jsx(Trans, { message: "Which localization should be selected by default for new users and guests." }),
            children: [
              /* @__PURE__ */ jsx(Item, { value: "auto", children: /* @__PURE__ */ jsx(Trans, { message: "Auto" }) }, "auto"),
              ((data == null ? void 0 : data.localizations) || []).map((locale) => /* @__PURE__ */ jsx(Item, { value: locale.language, capitalizeFirst: true, children: locale.name }, locale.language))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          FormRadioGroup,
          {
            required: true,
            className: "mb-30",
            size: "sm",
            name: "client.dates.format",
            orientation: "vertical",
            label: /* @__PURE__ */ jsx(Trans, { message: "Date verbosity" }),
            description: /* @__PURE__ */ jsx(Trans, { message: "Default verbosity for all dates displayed across the site. Month/day order and separators will be adjusted automatically, based on user's locale." }),
            children: [
              /* @__PURE__ */ jsx(FormRadio, { value: "auto", children: /* @__PURE__ */ jsx(Trans, { message: "Auto" }) }, "auto"),
              Object.entries(DateFormatPresets).map(([format, options]) => /* @__PURE__ */ jsx(FormRadio, { value: format, children: /* @__PURE__ */ jsx(FormattedDate, { date: today, options }) }, format))
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            name: "client.i18n.enable",
            description: /* @__PURE__ */ jsx(Trans, { message: "If disabled, site will always be shown in default language and user will not be able to change their locale." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Enable translations" })
          }
        )
      ]
    }
  );
}
function AuthenticationSettings() {
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Authentication" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Configure registration, social login and related 3rd party integrations." }),
      children: [
        /* @__PURE__ */ jsx(EmailConfirmationSection, {}),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            className: "mb-24",
            name: "client.registration.disable",
            description: /* @__PURE__ */ jsx(Trans, { message: "All registration related functionality (including social login) will be disabled." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Disable registration" })
          }
        ),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            className: "mb-24",
            name: "client.single_device_login",
            description: /* @__PURE__ */ jsx(Trans, { message: "Only allow one device to be logged into user account at the same time." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Single device login" })
          }
        ),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            name: "client.social.compact_buttons",
            description: /* @__PURE__ */ jsx(Trans, { message: "Use compact design for social login buttons." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Compact buttons" })
          }
        ),
        /* @__PURE__ */ jsx(EnvatoSection, {}),
        /* @__PURE__ */ jsx(GoogleSection, {}),
        /* @__PURE__ */ jsx(FacebookSection, {}),
        /* @__PURE__ */ jsx(TwitterSection, {}),
        /* @__PURE__ */ jsx(SettingsSeparator, {}),
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            inputElementType: "textarea",
            rows: 3,
            className: "mt-24",
            name: "client.auth.domain_blacklist",
            label: /* @__PURE__ */ jsx(Trans, { message: "Domain blacklist" }),
            description: /* @__PURE__ */ jsx(Trans, { message: "Comma separated list of domains. Users will not be able to register or login using any email adress from specified domains." })
          }
        )
      ]
    }
  );
}
function MailNotSetupWarning() {
  const { watch } = useFormContext();
  const mailSetup = watch("server.mail_setup");
  if (mailSetup)
    return null;
  return /* @__PURE__ */ jsx("p", { className: "mt-10 rounded-panel border p-10 text-sm text-danger", children: /* @__PURE__ */ jsx(
    Trans,
    {
      message: "Outgoing mail method needs to be setup before enabling this setting. <a>Fix now</a>",
      values: {
        a: (text) => /* @__PURE__ */ jsx(
          Button,
          {
            elementType: Link,
            variant: "outline",
            size: "xs",
            display: "flex",
            className: "mt-10 max-w-max",
            to: "/admin/settings/outgoing-email",
            children: text
          }
        )
      }
    }
  ) });
}
function EmailConfirmationSection() {
  return /* @__PURE__ */ jsx(
    FormSwitch,
    {
      className: "mb-30",
      name: "client.require_email_confirmation",
      description: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Trans, { message: "Require newly registered users to validate their email address before being able to login." }),
        /* @__PURE__ */ jsx(MailNotSetupWarning, {})
      ] }),
      children: /* @__PURE__ */ jsx(Trans, { message: "Require email confirmation" })
    }
  );
}
function EnvatoSection() {
  var _a2;
  const { watch } = useFormContext();
  const settings = useSettings();
  const envatoLoginEnabled = watch("client.social.envato.enable");
  if (!((_a2 = settings.envato) == null ? void 0 : _a2.enable))
    return null;
  return /* @__PURE__ */ jsx(SettingsErrorGroup, { separatorBottom: false, name: "envato_group", children: (isInvalid) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        invalid: isInvalid,
        name: "client.social.envato.enable",
        description: /* @__PURE__ */ jsx(Trans, { message: "Enable logging into the site via envato." }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Envato login" })
      }
    ),
    !!envatoLoginEnabled && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          invalid: isInvalid,
          className: "mt-30",
          name: "server.envato_id",
          label: /* @__PURE__ */ jsx(Trans, { message: "Envato ID" }),
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          invalid: isInvalid,
          className: "mt-30",
          name: "server.envato_secret",
          label: /* @__PURE__ */ jsx(Trans, { message: "Envato secret" }),
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          invalid: isInvalid,
          className: "mt-30",
          name: "server.envato_personal_token",
          label: /* @__PURE__ */ jsx(Trans, { message: "Envato personal token" }),
          required: true
        }
      )
    ] })
  ] }) });
}
function GoogleSection() {
  const { watch } = useFormContext();
  const googleLoginEnabled = watch("client.social.google.enable");
  return /* @__PURE__ */ jsx(SettingsErrorGroup, { name: "google_group", children: (isInvalid) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        invalid: isInvalid,
        name: "client.social.google.enable",
        description: /* @__PURE__ */ jsx(Trans, { message: "Enable logging into the site via google." }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Google login" })
      }
    ),
    !!googleLoginEnabled && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          invalid: isInvalid,
          className: "mt-30",
          name: "server.google_id",
          label: /* @__PURE__ */ jsx(Trans, { message: "Google client ID" }),
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          className: "mt-30",
          name: "server.google_secret",
          label: /* @__PURE__ */ jsx(Trans, { message: "Google client secret" }),
          required: true
        }
      )
    ] })
  ] }) });
}
function FacebookSection() {
  const { watch } = useFormContext();
  const facebookLoginEnabled = watch("client.social.facebook.enable");
  return /* @__PURE__ */ jsx(SettingsErrorGroup, { name: "facebook_group", separatorTop: false, children: (isInvalid) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        invalid: isInvalid,
        name: "client.social.facebook.enable",
        description: /* @__PURE__ */ jsx(Trans, { message: "Enable logging into the site via facebook." }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Facebook login" })
      }
    ),
    !!facebookLoginEnabled && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          invalid: isInvalid,
          className: "mt-30",
          name: "server.facebook_id",
          label: /* @__PURE__ */ jsx(Trans, { message: "Facebook app ID" }),
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        FormTextField,
        {
          invalid: isInvalid,
          className: "mt-30",
          name: "server.facebook_secret",
          label: /* @__PURE__ */ jsx(Trans, { message: "Facebook app secret" }),
          required: true
        }
      )
    ] })
  ] }) });
}
function TwitterSection() {
  const { watch } = useFormContext();
  const twitterLoginEnabled = watch("client.social.twitter.enable");
  return /* @__PURE__ */ jsx(
    SettingsErrorGroup,
    {
      name: "twitter_group",
      separatorTop: false,
      separatorBottom: false,
      children: (isInvalid) => /* @__PURE__ */ jsxs(Fragment$1, { children: [
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            invalid: isInvalid,
            name: "client.social.twitter.enable",
            description: /* @__PURE__ */ jsx(Trans, { message: "Enable logging into the site via twitter." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Twitter login" })
          }
        ),
        !!twitterLoginEnabled && /* @__PURE__ */ jsxs(Fragment$1, { children: [
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              invalid: isInvalid,
              className: "mt-30",
              name: "server.twitter_id",
              label: /* @__PURE__ */ jsx(Trans, { message: "Twitter ID" }),
              required: true
            }
          ),
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              invalid: isInvalid,
              className: "mt-30",
              name: "server.twitter_secret",
              label: /* @__PURE__ */ jsx(Trans, { message: "Twitter secret" }),
              required: true
            }
          )
        ] })
      ] })
    }
  );
}
function fetchMaxServerUploadSize() {
  return apiClient.get("uploads/server-max-file-size").then((response) => response.data);
}
function useMaxServerUploadSize() {
  return useQuery({
    queryKey: ["MaxServerUploadSize"],
    queryFn: () => fetchMaxServerUploadSize()
  });
}
const spaceUnits = ["B", "KB", "MB", "GB", "TB", "PB"];
function convertToBytes(value, unit) {
  if (value == null)
    return 0;
  switch (unit) {
    case "KB":
      return value * 1024;
    case "MB":
      return value * 1024 ** 2;
    case "GB":
      return value * 1024 ** 3;
    case "TB":
      return value * 1024 ** 4;
    case "PB":
      return value * 1024 ** 5;
    default:
      return value;
  }
}
const MaxValue = 108851651149824;
const FormFileSizeField = React.forwardRef(({ name, ...props }, ref) => {
  const {
    field: {
      onChange: setByteValue,
      onBlur,
      value: byteValue = "",
      ref: inputRef
    },
    fieldState: { invalid, error }
  } = useController({
    name
  });
  const [liveValue, setLiveValue] = useState("");
  const [unit, setUnit] = useState("MB");
  useEffect(() => {
    if (byteValue == null || byteValue === "") {
      setLiveValue("");
      return;
    }
    const { amount, unit: newUnit } = fromBytes({
      bytes: Math.min(byteValue, MaxValue)
    });
    setUnit(newUnit || "MB");
    setLiveValue(Number.isNaN(amount) ? "" : amount);
  }, [byteValue, unit]);
  const formProps = {
    onChange: (e) => {
      const value = parseInt(e.target.value);
      if (Number.isNaN(value)) {
        setByteValue(value);
      } else {
        const newBytes = convertToBytes(
          parseInt(e.target.value),
          unit
        );
        setByteValue(newBytes);
      }
    },
    onBlur,
    value: liveValue,
    invalid,
    errorMessage: error == null ? void 0 : error.message,
    inputRef
  };
  const unitSelect = /* @__PURE__ */ jsx(
    SelectForwardRef,
    {
      minWidth: "min-w-80",
      selectionMode: "single",
      selectedValue: unit,
      disabled: !byteValue,
      onSelectionChange: (newUnit) => {
        const newBytes = convertToBytes(
          liveValue || 0,
          newUnit
        );
        setByteValue(newBytes);
      },
      children: spaceUnits.slice(0, 5).map((u) => /* @__PURE__ */ jsx(Item, { value: u, children: u === "B" ? "Bytes" : u }, u))
    }
  );
  return /* @__PURE__ */ jsx(
    TextField,
    {
      ...mergeProps(formProps, props),
      type: "number",
      ref,
      endAppend: unitSelect
    }
  );
});
const fromBytes = memoize(
  ({ bytes }) => {
    const pretty = prettyBytes(bytes);
    if (!pretty)
      return { amount: "", unit: "MB" };
    let amount = parseInt(pretty.split(" ")[0]);
    amount = Math.round(amount);
    return { amount, unit: pretty.split(" ")[1] };
  }
);
function useUploadS3Cors() {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: () => uploadCors(),
    onSuccess: () => {
      toast(trans(message("CORS file updated")));
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function uploadCors() {
  return apiClient.post("s3/cors/upload").then((r) => r.data);
}
function useGenerateDropboxRefreshToken() {
  return useMutation({
    mutationFn: (props) => generateToken(props),
    onError: (err) => showHttpErrorToast(err)
  });
}
function generateToken(payload) {
  return apiClient.post("settings/uploading/dropbox-refresh-token", payload).then((r) => r.data);
}
function DropboxForm({ isInvalid }) {
  const { watch, setValue } = useFormContext();
  const appKey = watch("server.storage_dropbox_app_key");
  const appSecret = watch("server.storage_dropbox_app_secret");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-20",
        name: "server.storage_dropbox_app_key",
        label: /* @__PURE__ */ jsx(Trans, { message: "Dropbox application key" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-20",
        name: "server.storage_dropbox_app_secret",
        label: /* @__PURE__ */ jsx(Trans, { message: "Dropbox application secret" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-20",
        name: "server.storage_dropbox_refresh_token",
        label: /* @__PURE__ */ jsx(Trans, { message: "Dropbox refresh token" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsxs(
      DialogTrigger,
      {
        type: "modal",
        onClose: (refreshToken) => {
          if (refreshToken) {
            setValue("server.storage_dropbox_refresh_token", refreshToken);
          }
        },
        children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              color: "primary",
              size: "xs",
              disabled: !appKey || !appSecret,
              children: /* @__PURE__ */ jsx(Trans, { message: "Get dropbox refresh token" })
            }
          ),
          /* @__PURE__ */ jsx(DropboxRefreshTokenDialog, { appKey, appSecret })
        ]
      }
    )
  ] });
}
function DropboxRefreshTokenDialog({
  appKey,
  appSecret
}) {
  const form = useForm();
  const { formId, close } = useDialogContext();
  const generateRefreshToken = useGenerateDropboxRefreshToken();
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Connected dropbox account" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsxs(
      Form$1,
      {
        id: formId,
        form,
        onSubmit: (data) => {
          generateRefreshToken.mutate(
            {
              app_key: appKey,
              app_secret: appSecret,
              access_code: data.accessCode
            },
            {
              onSuccess: (response) => {
                close(response.refreshToken);
              }
            }
          );
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-20 pb-20 border-b", children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted text-sm mb-10", children: /* @__PURE__ */ jsx(Trans, { message: "Click the 'get access code' button to get dropbox access code, then paste it into the field below." }) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                color: "primary",
                size: "xs",
                elementType: "a",
                target: "_blank",
                href: `https://www.dropbox.com/oauth2/authorize?client_id=${appKey}&token_access_type=offline&response_type=code`,
                children: /* @__PURE__ */ jsx(Trans, { message: "Get access code" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              name: "accessCode",
              label: /* @__PURE__ */ jsx(Trans, { message: "Dropbox access code" }),
              required: true
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            close();
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          form: formId,
          type: "submit",
          disabled: !appKey || !appSecret || generateRefreshToken.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Connect" })
        }
      )
    ] })
  ] });
}
function UploadingSettings() {
  const { trans } = useTrans();
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Uploading" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Configure size and type of files that users are able to upload. This will affect all uploads across the site." }),
      children: [
        /* @__PURE__ */ jsx(PrivateUploadSection, {}),
        /* @__PURE__ */ jsx(PublicUploadSection, {}),
        /* @__PURE__ */ jsx(CredentialsSection, {}),
        /* @__PURE__ */ jsx(SettingsErrorGroup, { name: "static_delivery_group", children: (isInvalid) => /* @__PURE__ */ jsxs(
          FormRadioGroup,
          {
            invalid: isInvalid,
            size: "sm",
            name: "server.static_file_delivery",
            orientation: "vertical",
            label: /* @__PURE__ */ jsx(Trans, { message: "File delivery optimization" }),
            description: /* @__PURE__ */ jsx(Trans, { message: "Both X-Sendfile and X-Accel need to be enabled on the server first. When enabled, it will reduce server memory and CPU usage when previewing or downloading files, especially for large files." }),
            children: [
              /* @__PURE__ */ jsx(FormRadio, { value: "", children: /* @__PURE__ */ jsx(Trans, { message: "None" }) }),
              /* @__PURE__ */ jsx(FormRadio, { value: "xsendfile", children: /* @__PURE__ */ jsx(Trans, { message: "X-Sendfile (Apache)" }) }),
              /* @__PURE__ */ jsx(FormRadio, { value: "xaccel", children: /* @__PURE__ */ jsx(Trans, { message: "X-Accel (Nginx)" }) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx(
          FormFileSizeField,
          {
            className: "mb-30",
            name: "client.uploads.chunk_size",
            min: 1,
            label: /* @__PURE__ */ jsx(Trans, { message: "Chunk size" }),
            placeholder: "Infinity",
            description: /* @__PURE__ */ jsx(Trans, { message: "Size (in bytes) for each file chunk. It should only be changed if there is a maximum upload size on your server or proxy (for example cloudflare). If chunk size is larger then limit on the server, uploads will fail." })
          }
        ),
        /* @__PURE__ */ jsx(MaxUploadSizeSection, {}),
        /* @__PURE__ */ jsx(SettingsSeparator, {}),
        /* @__PURE__ */ jsx(
          FormFileSizeField,
          {
            min: 1,
            name: "client.uploads.max_size",
            className: "mb-30",
            label: /* @__PURE__ */ jsx(Trans, { message: "Maximum file size" }),
            description: /* @__PURE__ */ jsx(Trans, { message: "Maximum size (in bytes) for a single file user can upload." })
          }
        ),
        /* @__PURE__ */ jsx(
          FormFileSizeField,
          {
            min: 1,
            name: "client.uploads.available_space",
            className: "mb-30",
            label: /* @__PURE__ */ jsx(Trans, { message: "Available space" }),
            description: /* @__PURE__ */ jsx(Trans, { message: "Disk space (in bytes) each user uploads are allowed to take up. This can be overridden per user." })
          }
        ),
        /* @__PURE__ */ jsx(
          JsonChipField,
          {
            name: "client.uploads.allowed_extensions",
            className: "mb-30",
            label: /* @__PURE__ */ jsx(Trans, { message: "Allowed extensions" }),
            placeholder: trans(message("Add extension...")),
            description: /* @__PURE__ */ jsx(Trans, { message: "List of allowed file types (jpg, mp3, pdf etc.). Leave empty to allow all file types." })
          }
        ),
        /* @__PURE__ */ jsx(
          JsonChipField,
          {
            name: "client.uploads.blocked_extensions",
            label: /* @__PURE__ */ jsx(Trans, { message: "Blocked extensions" }),
            placeholder: trans(message("Add extension...")),
            description: /* @__PURE__ */ jsx(Trans, { message: "Prevent uploading of these file types, even if they are allowed above." })
          }
        )
      ]
    }
  );
}
function MaxUploadSizeSection() {
  const { data } = useMaxServerUploadSize();
  return /* @__PURE__ */ jsx(
    SectionHelper,
    {
      color: "warning",
      description: /* @__PURE__ */ jsx(
        Trans,
        {
          message: "Maximum upload size on your server currently is set to <b>:size</b>",
          values: { size: data == null ? void 0 : data.maxSize, b: (chunks) => /* @__PURE__ */ jsx("b", { children: chunks }) }
        }
      )
    }
  );
}
function PrivateUploadSection() {
  const { watch, clearErrors } = useFormContext();
  const isEnabled = watch("server.uploads_disk_driver");
  if (!isEnabled)
    return null;
  return /* @__PURE__ */ jsxs(
    FormSelect,
    {
      className: "mb-30",
      selectionMode: "single",
      name: "server.uploads_disk_driver",
      label: /* @__PURE__ */ jsx(Trans, { message: "User Uploads Storage Method" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Where should user private file uploads be stored." }),
      onSelectionChange: () => {
        clearErrors();
      },
      children: [
        /* @__PURE__ */ jsx(Item, { value: "local", children: /* @__PURE__ */ jsx(Trans, { message: "Local Disk (Default)" }) }),
        /* @__PURE__ */ jsx(Item, { value: "ftp", children: "FTP" }),
        /* @__PURE__ */ jsx(Item, { value: "digitalocean_s3", children: "DigitalOcean Spaces" }),
        /* @__PURE__ */ jsx(Item, { value: "backblaze_s3", children: "Backblaze" }),
        /* @__PURE__ */ jsx(Item, { value: "s3", children: "Amazon S3 (Or compatible service)" }),
        /* @__PURE__ */ jsx(Item, { value: "dropbox", children: "Dropbox" }),
        /* @__PURE__ */ jsx(Item, { value: "rackspace", children: "Rackspace" })
      ]
    }
  );
}
function PublicUploadSection() {
  const { watch, clearErrors } = useFormContext();
  const isEnabled = watch("server.public_disk_driver");
  if (!isEnabled)
    return null;
  return /* @__PURE__ */ jsxs(
    FormSelect,
    {
      label: /* @__PURE__ */ jsx(Trans, { message: "Public Uploads Storage Method" }),
      selectionMode: "single",
      name: "server.public_disk_driver",
      description: /* @__PURE__ */ jsx(Trans, { message: "Where should user public uploads (like avatars) be stored." }),
      onSelectionChange: () => {
        clearErrors();
      },
      children: [
        /* @__PURE__ */ jsx(Item, { value: "local", children: /* @__PURE__ */ jsx(Trans, { message: "Local Disk (Default)" }) }),
        /* @__PURE__ */ jsx(Item, { value: "s3", children: "Amazon S3" }),
        /* @__PURE__ */ jsx(Item, { value: "ftp", children: "FTP" }),
        /* @__PURE__ */ jsx(Item, { value: "digitalocean_s3", children: "DigitalOcean Spaces" }),
        /* @__PURE__ */ jsx(Item, { value: "backblaze_s3", children: "Backblaze" })
      ]
    }
  );
}
function CredentialsSection() {
  const { watch } = useFormContext();
  const drives = [
    watch("server.uploads_disk_driver"),
    watch("server.public_disk_driver")
  ];
  if (drives[0] === "local" && drives[1] === "local") {
    return null;
  }
  return /* @__PURE__ */ jsx(SettingsErrorGroup, { separatorBottom: false, name: "storage_group", children: (isInvalid) => {
    if (drives.includes("s3")) {
      return /* @__PURE__ */ jsx(S3Form, { isInvalid });
    }
    if (drives.includes("ftp")) {
      return /* @__PURE__ */ jsx(FtpForm, { isInvalid });
    }
    if (drives.includes("dropbox")) {
      return /* @__PURE__ */ jsx(DropboxForm, { isInvalid });
    }
    if (drives.includes("digitalocean_s3")) {
      return /* @__PURE__ */ jsx(DigitalOceanForm, { isInvalid });
    }
    if (drives.includes("backblaze_s3")) {
      return /* @__PURE__ */ jsx(BackblazeForm, { isInvalid });
    }
  } });
}
function S3Form({ isInvalid }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_s3_key",
        label: /* @__PURE__ */ jsx(Trans, { message: "Amazon S3 key" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_s3_secret",
        label: /* @__PURE__ */ jsx(Trans, { message: "Amazon S3 secret" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_s3_region",
        label: /* @__PURE__ */ jsx(Trans, { message: "Amazon S3 region" }),
        pattern: "[a-z1-9\\-]+",
        placeholder: "us-east-1"
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_s3_bucket",
        label: /* @__PURE__ */ jsx(Trans, { message: "Amazon S3 bucket" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        name: "server.storage_s3_endpoint",
        label: /* @__PURE__ */ jsx(Trans, { message: "Amazon S3 endpoint" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Only change endpoint if you are using another S3 compatible storage service." })
      }
    ),
    /* @__PURE__ */ jsx(S3DirectUploadField, { invalid: isInvalid })
  ] });
}
function DigitalOceanForm({ isInvalid }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_digitalocean_key",
        label: /* @__PURE__ */ jsx(Trans, { message: "DigitalOcean key" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_digitalocean_secret",
        label: /* @__PURE__ */ jsx(Trans, { message: "DigitalOcean secret" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_digitalocean_region",
        label: /* @__PURE__ */ jsx(Trans, { message: "DigitalOcean region" }),
        pattern: "[a-z0-9\\-]+",
        placeholder: "us-east-1",
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_digitalocean_bucket",
        label: /* @__PURE__ */ jsx(Trans, { message: "DigitalOcean bucket" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(S3DirectUploadField, { invalid: isInvalid })
  ] });
}
function BackblazeForm({ isInvalid }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_backblaze_key",
        label: /* @__PURE__ */ jsx(Trans, { message: "Backblaze KeyID" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_backblaze_secret",
        label: /* @__PURE__ */ jsx(Trans, { message: "Backblaze applicationKey" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_backblaze_region",
        label: /* @__PURE__ */ jsx(Trans, { message: "Backblaze Region" }),
        pattern: "[a-z0-9\\-]+",
        placeholder: "us-west-002",
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_backblaze_bucket",
        label: /* @__PURE__ */ jsx(Trans, { message: "Backblaze bucket name" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(S3DirectUploadField, { invalid: isInvalid })
  ] });
}
function S3DirectUploadField({ invalid }) {
  var _a2, _b;
  const uploadCors2 = useUploadS3Cors();
  const { data: defaultSettings } = useAdminSettings();
  const s3DriverEnabled = ((_a2 = defaultSettings == null ? void 0 : defaultSettings.server.uploads_disk_driver) == null ? void 0 : _a2.endsWith("s3")) || ((_b = defaultSettings == null ? void 0 : defaultSettings.server.public_disk_driver) == null ? void 0 : _b.endsWith("s3"));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        className: "mt-30",
        invalid,
        name: "client.uploads.s3_direct_upload",
        description: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ jsx(Trans, { message: "Upload files directly from the browser to s3 without going through the server. It will save on server bandwidth and should result in faster upload times. This should be enabled, unless storage provider does not support multipart uploads." }) }),
          /* @__PURE__ */ jsx("p", { className: "mt-10", children: /* @__PURE__ */ jsx(Trans, { message: "If s3 provider is not configured to allow uploads from browser, this can be done automatically via CORS button below, when valid credentials are saved." }) })
        ] }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Direct upload" })
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "flat",
        color: "primary",
        size: "xs",
        className: "mt-20",
        onClick: () => {
          uploadCors2.mutate();
        },
        disabled: !s3DriverEnabled || uploadCors2.isPending,
        children: /* @__PURE__ */ jsx(Trans, { message: "Configure CORS" })
      }
    )
  ] });
}
function FtpForm({ isInvalid }) {
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_ftp_host",
        label: /* @__PURE__ */ jsx(Trans, { message: "FTP hostname" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_ftp_username",
        label: /* @__PURE__ */ jsx(Trans, { message: "FTP username" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_ftp_password",
        label: /* @__PURE__ */ jsx(Trans, { message: "FTP password" }),
        type: "password",
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_ftp_root",
        label: /* @__PURE__ */ jsx(Trans, { message: "FTP directory" }),
        placeholder: "/"
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.storage_ftp_port",
        label: /* @__PURE__ */ jsx(Trans, { message: "FTP port" }),
        type: "number",
        min: 0,
        placeholder: "21"
      }
    ),
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        invalid: isInvalid,
        name: "server.storage_ftp_passive",
        className: "mb-30",
        children: /* @__PURE__ */ jsx(Trans, { message: "Passive" })
      }
    ),
    /* @__PURE__ */ jsx(FormSwitch, { invalid: isInvalid, name: "server.storage_ftp_ssl", children: /* @__PURE__ */ jsx(Trans, { message: "SSL" }) })
  ] });
}
function MailgunCredentials({ isInvalid }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.mailgun_domain",
        label: /* @__PURE__ */ jsx(Trans, { message: "Mailgun domain" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Usually the domain of your site (site.com)" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.mailgun_secret",
        label: /* @__PURE__ */ jsx(Trans, { message: "Mailgun API key" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Should start with `key-`" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        name: "server.mailgun_endpoint",
        label: /* @__PURE__ */ jsx(Trans, { message: "Mailgun endpoint" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Can be left empty, if your mailgun account is in the US region." }),
        placeholder: "api.eu.mailgun.net"
      }
    )
  ] });
}
function SmtpCredentials({ isInvalid }) {
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.mail_host",
        label: /* @__PURE__ */ jsx(Trans, { message: "SMTP host" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.mail_username",
        label: /* @__PURE__ */ jsx(Trans, { message: "SMTP username" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        type: "password",
        name: "server.mail_password",
        label: /* @__PURE__ */ jsx(Trans, { message: "SMTP password" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        type: "number",
        name: "server.mail_port",
        label: /* @__PURE__ */ jsx(Trans, { message: "SMTP port" })
      }
    ),
    /* @__PURE__ */ jsxs(
      FormSelect,
      {
        selectionMode: "single",
        invalid: isInvalid,
        className: "mb-30",
        name: "server.mail_encryption",
        label: /* @__PURE__ */ jsx(Trans, { message: "SMTP encryption" }),
        children: [
          /* @__PURE__ */ jsx(Item, { value: "", children: /* @__PURE__ */ jsx(Trans, { message: "None" }) }),
          /* @__PURE__ */ jsx(Item, { value: "tls", children: /* @__PURE__ */ jsx(Trans, { message: "TLS" }) })
        ]
      }
    )
  ] });
}
function SesCredentials({ isInvalid }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.ses_key",
        label: /* @__PURE__ */ jsx(Trans, { message: "SES key" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.ses_secret",
        label: /* @__PURE__ */ jsx(Trans, { message: "SES secret" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        name: "server.ses_region",
        label: /* @__PURE__ */ jsx(Trans, { message: "SES region" }),
        placeholder: "us-east-1",
        required: true
      }
    )
  ] });
}
function PostmarkCredentials({ isInvalid }) {
  return /* @__PURE__ */ jsx(
    FormTextField,
    {
      invalid: isInvalid,
      name: "server.postmark_token",
      label: /* @__PURE__ */ jsx(Trans, { message: "Postmark token" }),
      required: true
    }
  );
}
const GmailIcon = createSvgIcon(
  [
    /* @__PURE__ */ jsx(
      "path",
      {
        fill: "#4caf50",
        d: "M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"
      },
      "0"
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        fill: "#1e88e5",
        d: "M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"
      },
      "1"
    ),
    /* @__PURE__ */ jsx(
      "polygon",
      {
        fill: "#e53935",
        points: "35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
      },
      "2"
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        fill: "#c62828",
        d: "M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
      },
      "3"
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        fill: "#fbc02d",
        d: "M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"
      },
      "4"
    )
  ],
  "Gmail",
  "0 0 48 48"
);
function ConnectGmailPanel() {
  const { watch, setValue } = useFormContext();
  const { connectSocial } = useSocialLogin();
  const connectedEmail = watch("server.connectedGmailAccount");
  const handleGmailConnect = async () => {
    const e = await connectSocial("secure/settings/mail/gmail/connect");
    if ((e == null ? void 0 : e.status) === "SUCCESS") {
      const email = e.callbackData.profile.email;
      setValue("server.connectedGmailAccount", email);
      toast(message("Connected gmail account: :email", { values: { email } }));
    }
  };
  const connectButton = /* @__PURE__ */ jsx(
    Button,
    {
      variant: "outline",
      color: "primary",
      startIcon: /* @__PURE__ */ jsx(GmailIcon, {}),
      onClick: () => {
        handleGmailConnect();
      },
      children: /* @__PURE__ */ jsx(Trans, { message: "Connect gmail account" })
    }
  );
  const reconnectPanel = /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-14 rounded border bg-alt px-14 py-6 text-sm", children: [
    /* @__PURE__ */ jsx(GmailIcon, { size: "lg" }),
    connectedEmail,
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "text",
        color: "primary",
        className: "ml-auto",
        onClick: () => {
          handleGmailConnect();
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Reconnect" })
      }
    )
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 text-sm", children: /* @__PURE__ */ jsx(Trans, { message: "Gmail account" }) }),
    connectedEmail ? reconnectPanel : connectButton
  ] });
}
function OutgoingMailGroup() {
  const { watch, clearErrors } = useFormContext();
  const selectedDriver = watch("server.mail_driver");
  const credentialForms = [];
  if (selectedDriver === "mailgun") {
    credentialForms.push(MailgunCredentials);
  }
  if (selectedDriver === "smtp") {
    credentialForms.push(SmtpCredentials);
  }
  if (selectedDriver === "ses") {
    credentialForms.push(SesCredentials);
  }
  if (selectedDriver === "postmark") {
    credentialForms.push(PostmarkCredentials);
  }
  if (selectedDriver === "gmailApi") {
    credentialForms.push(ConnectGmailPanel);
  }
  return /* @__PURE__ */ jsx(
    SettingsErrorGroup,
    {
      separatorTop: false,
      separatorBottom: false,
      name: "mail_group",
      children: (isInvalid) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(
          FormSelect,
          {
            onSelectionChange: () => {
              clearErrors();
            },
            invalid: isInvalid,
            selectionMode: "single",
            name: "server.mail_driver",
            label: /* @__PURE__ */ jsx(Trans, { message: "Outgoing mail method" }),
            description: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Trans, { message: "Which method should be used for sending outgoing application emails (like registration confirmation)" }),
              /* @__PURE__ */ jsx(
                LearnMoreLink,
                {
                  className: "mt-8",
                  link: "https://support.vebto.com/help-center/articles/42/44/155/incoming-emails"
                }
              )
            ] }),
            children: [
              /* @__PURE__ */ jsx(Item, { value: "mailgun", children: "Mailgun" }),
              /* @__PURE__ */ jsx(Item, { value: "gmailApi", children: "Gmail Api" }),
              /* @__PURE__ */ jsx(Item, { value: "smtp", children: "SMTP" }),
              /* @__PURE__ */ jsx(Item, { value: "postmark", children: "Postmark" }),
              /* @__PURE__ */ jsx(Item, { value: "ses", children: "Ses (Amazon Simple Email Service)" }),
              /* @__PURE__ */ jsx(Item, { value: "sendmail", children: "SendMail" }),
              /* @__PURE__ */ jsx(Item, { value: "log", children: "Log (Email will be saved to error log)" })
            ]
          }
        ),
        credentialForms.length ? /* @__PURE__ */ jsx("div", { className: "mt-30", children: credentialForms.map((CredentialsForm, index) => /* @__PURE__ */ jsx(CredentialsForm, { isInvalid }, index)) }) : null
      ] })
    }
  );
}
function OutgoingEmailSettings() {
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Outgoing email settings" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Change outgoing email handlers, email credentials and other related settings." }),
      children: [
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            id: "outgoing-emails",
            className: "mb-30",
            type: "email",
            name: "server.mail_from_address",
            label: /* @__PURE__ */ jsx(Trans, { message: "From address" }),
            description: /* @__PURE__ */ jsx(Trans, { message: "All outgoing application emails will be sent from this email address." }),
            required: true
          }
        ),
        /* @__PURE__ */ jsx(ContactAddressSection, {}),
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            className: "mb-30",
            name: "server.mail_from_name",
            label: /* @__PURE__ */ jsx(Trans, { message: "From name" }),
            description: /* @__PURE__ */ jsx(Trans, { message: "All outgoing application emails will be sent using this name." }),
            required: true
          }
        ),
        /* @__PURE__ */ jsx(
          SectionHelper,
          {
            color: "warning",
            description: /* @__PURE__ */ jsx(Trans, { message: "Your selected mail method must be authorized to send emails using this address and name." })
          }
        ),
        /* @__PURE__ */ jsx(SettingsSeparator, {}),
        /* @__PURE__ */ jsx(OutgoingMailGroup, {})
      ]
    }
  );
}
function ContactAddressSection() {
  const { base_url } = useSettings();
  const contactPageUrl = `${base_url}/contact`;
  const link = /* @__PURE__ */ jsx(ExternalLink, { href: contactPageUrl, children: contactPageUrl });
  return /* @__PURE__ */ jsx(
    FormTextField,
    {
      className: "mb-30",
      type: "email",
      name: "client.mail.contact_page_address",
      label: /* @__PURE__ */ jsx(Trans, { message: "Contact page address" }),
      description: /* @__PURE__ */ jsx(
        Trans,
        {
          values: {
            contactPageUrl: link
          },
          message: "Where emails from :contactPageUrl page should be sent to."
        }
      )
    }
  );
}
function clearCache() {
  return apiClient.post("cache/flush").then((r) => r.data);
}
function useClearCache() {
  return useMutation({
    mutationFn: () => clearCache(),
    onSuccess: () => {
      toast(message("Cache cleared"));
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function CacheSettings() {
  const clearCache2 = useClearCache();
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Cache settings" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Select cache provider and manually clear cache." }),
      children: [
        /* @__PURE__ */ jsx(CacheSelect, {}),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "xs",
            color: "primary",
            disabled: clearCache2.isPending,
            onClick: () => {
              clearCache2.mutate();
            },
            children: /* @__PURE__ */ jsx(Trans, { message: "Clear cache" })
          }
        ),
        /* @__PURE__ */ jsx(
          SectionHelper,
          {
            color: "warning",
            className: "mt-30",
            description: /* @__PURE__ */ jsx(
              Trans,
              {
                message: '"File" is the best option for most cases and should not be changed, unless you are familiar with another cache method and have it set up on the server already.'
              }
            )
          }
        )
      ]
    }
  );
}
function CacheSelect() {
  const { watch, clearErrors } = useFormContext();
  const cacheDriver = watch("server.cache_driver");
  let CredentialSection = null;
  if (cacheDriver === "memcached") {
    CredentialSection = MemcachedCredentials;
  }
  return /* @__PURE__ */ jsx(SettingsErrorGroup, { separatorTop: false, name: "cache_group", children: (isInvalid) => {
    return /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsxs(
        FormSelect,
        {
          invalid: isInvalid,
          onSelectionChange: () => {
            clearErrors();
          },
          selectionMode: "single",
          name: "server.cache_driver",
          label: /* @__PURE__ */ jsx(Trans, { message: "Cache method" }),
          description: /* @__PURE__ */ jsx(Trans, { message: "Which method should be used for storing and retrieving cached items." }),
          children: [
            /* @__PURE__ */ jsx(Item, { value: "file", children: /* @__PURE__ */ jsx(Trans, { message: "File (Default)" }) }),
            /* @__PURE__ */ jsx(Item, { value: "array", children: /* @__PURE__ */ jsx(Trans, { message: "None" }) }),
            /* @__PURE__ */ jsx(Item, { value: "apc", children: "APC" }),
            /* @__PURE__ */ jsx(Item, { value: "memcached", children: "Memcached" }),
            /* @__PURE__ */ jsx(Item, { value: "redis", children: "Redis" })
          ]
        }
      ),
      CredentialSection && /* @__PURE__ */ jsx("div", { className: "mt-30", children: /* @__PURE__ */ jsx(CredentialSection, { isInvalid }) })
    ] });
  } });
}
function MemcachedCredentials({ isInvalid }) {
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.memcached_host",
        label: /* @__PURE__ */ jsx(Trans, { message: "Memcached host" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        type: "number",
        name: "server.memcached_port",
        label: /* @__PURE__ */ jsx(Trans, { message: "Memcached port" }),
        required: true
      }
    )
  ] });
}
function LoggingSettings() {
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Error logging" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Configure site error logging and related 3rd party integrations." }),
      children: [
        /* @__PURE__ */ jsx(SentrySection, {}),
        /* @__PURE__ */ jsx(
          SectionHelper,
          {
            className: "mt-30",
            color: "positive",
            description: /* @__PURE__ */ jsx(
              Trans,
              {
                values: {
                  a: (parts) => /* @__PURE__ */ jsx(ExternalLink, { href: "https://sentry.io", children: parts })
                },
                message: "<a>Sentry</a> integration provides real-time error tracking and helps identify and fix issues when site is in production."
              }
            )
          }
        )
      ]
    }
  );
}
function SentrySection() {
  const { clearErrors } = useFormContext();
  return /* @__PURE__ */ jsx(
    SettingsErrorGroup,
    {
      separatorTop: false,
      separatorBottom: false,
      name: "logging_group",
      children: (isInvalid) => {
        return /* @__PURE__ */ jsx(
          FormTextField,
          {
            onChange: () => {
              clearErrors();
            },
            invalid: isInvalid,
            name: "server.sentry_dsn",
            type: "url",
            minLength: 30,
            label: /* @__PURE__ */ jsx(Trans, { message: "Sentry DSN" })
          }
        );
      }
    }
  );
}
function QueueSettings() {
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Queue" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Select active queue method and enter related 3rd party API keys." }),
      children: [
        /* @__PURE__ */ jsx(
          SectionHelper,
          {
            color: "positive",
            className: "mb-30",
            description: /* @__PURE__ */ jsx(Trans, { message: "Queues allow to defer time consuming tasks, such as sending an email, until a later time. Deferring these tasks can speed up web requests to the application." })
          }
        ),
        /* @__PURE__ */ jsx(
          SectionHelper,
          {
            color: "warning",
            className: "mb-30",
            description: /* @__PURE__ */ jsx(Trans, { message: "All methods except sync require additional setup, which should be performed before changing the queue method. Consult documentation for more information." })
          }
        ),
        /* @__PURE__ */ jsx(DriverSection, {})
      ]
    }
  );
}
function DriverSection() {
  const { watch, clearErrors } = useFormContext();
  const queueDriver = watch("server.queue_driver");
  let CredentialSection = null;
  if (queueDriver === "sqs") {
    CredentialSection = SqsCredentials;
  }
  return /* @__PURE__ */ jsx(
    SettingsErrorGroup,
    {
      separatorTop: false,
      separatorBottom: false,
      name: "queue_group",
      children: (isInvalid) => {
        return /* @__PURE__ */ jsxs(Fragment$1, { children: [
          /* @__PURE__ */ jsxs(
            FormSelect,
            {
              invalid: isInvalid,
              onSelectionChange: () => {
                clearErrors();
              },
              selectionMode: "single",
              name: "server.queue_driver",
              label: /* @__PURE__ */ jsx(Trans, { message: "Queue method" }),
              required: true,
              children: [
                /* @__PURE__ */ jsx(Item, { value: "sync", children: /* @__PURE__ */ jsx(Trans, { message: "Sync (Default)" }) }),
                /* @__PURE__ */ jsx(Item, { value: "beanstalkd", children: "Beanstalkd" }),
                /* @__PURE__ */ jsx(Item, { value: "database", children: /* @__PURE__ */ jsx(Trans, { message: "Database" }) }),
                /* @__PURE__ */ jsx(Item, { value: "sqs", children: /* @__PURE__ */ jsx(Trans, { message: "SQS (Amazon simple queue service)" }) }),
                /* @__PURE__ */ jsx(Item, { value: "redis", children: "Redis" })
              ]
            }
          ),
          CredentialSection && /* @__PURE__ */ jsx("div", { className: "mt-30", children: /* @__PURE__ */ jsx(CredentialSection, { isInvalid }) })
        ] });
      }
    }
  );
}
function SqsCredentials({ isInvalid }) {
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.sqs_queue_key",
        label: /* @__PURE__ */ jsx(Trans, { message: "SQS queue key" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.sqs_queue_secret",
        label: /* @__PURE__ */ jsx(Trans, { message: "SQS queue secret" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.sqs_queue_prefix",
        label: /* @__PURE__ */ jsx(Trans, { message: "SQS queue prefix" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.sqs_queue_name",
        label: /* @__PURE__ */ jsx(Trans, { message: "SQS queue name" }),
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        invalid: isInvalid,
        className: "mb-30",
        name: "server.sqs_queue_region",
        label: /* @__PURE__ */ jsx(Trans, { message: "SQS queue region" }),
        required: true
      }
    )
  ] });
}
function RecaptchaSettings() {
  const { settings } = useContext(SiteConfigContext);
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Recaptcha" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Configure google recaptcha integration and credentials." }),
      children: [
        (settings == null ? void 0 : settings.showRecaptchaLinkSwitch) && /* @__PURE__ */ jsx(
          FormSwitch,
          {
            className: "mb-30",
            name: "client.recaptcha.enable.link_creation",
            description: /* @__PURE__ */ jsx(Trans, { message: "Enable recaptcha integration when creating links from homepage or user dashboard." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Link creation" })
          }
        ),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            className: "mb-30",
            name: "client.recaptcha.enable.contact",
            description: /* @__PURE__ */ jsx(
              Trans,
              {
                message: 'Enable recaptcha integration for "contact us" page.'
              }
            ),
            children: /* @__PURE__ */ jsx(Trans, { message: "Contact page" })
          }
        ),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            className: "mb-30",
            name: "client.recaptcha.enable.register",
            description: /* @__PURE__ */ jsx(Trans, { message: "Enable recaptcha integration for registration page." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Registration page" })
          }
        ),
        /* @__PURE__ */ jsx(RecaptchaSection, {})
      ]
    }
  );
}
function RecaptchaSection() {
  const { clearErrors } = useFormContext();
  return /* @__PURE__ */ jsx(
    SettingsErrorGroup,
    {
      separatorTop: false,
      separatorBottom: false,
      name: "recaptcha_group",
      children: (isInvalid) => {
        return /* @__PURE__ */ jsxs(Fragment$1, { children: [
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              className: "mb-30",
              onChange: () => {
                clearErrors();
              },
              invalid: isInvalid,
              name: "client.recaptcha.site_key",
              label: /* @__PURE__ */ jsx(Trans, { message: "Recaptcha v3 site key" })
            }
          ),
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              onChange: () => {
                clearErrors();
              },
              invalid: isInvalid,
              name: "client.recaptcha.secret_key",
              label: /* @__PURE__ */ jsx(Trans, { message: "Recaptcha v3 secret key" })
            }
          )
        ] });
      }
    }
  );
}
const FileField = React.forwardRef(
  (props, ref) => {
    const inputRef = useObjectRef(ref);
    const { fieldProps, inputProps } = useField({ ...props, focusRef: inputRef });
    const inputFieldClassNames = getInputFieldClassNames(props);
    return /* @__PURE__ */ jsx(Field, { ref, fieldClassNames: inputFieldClassNames, ...fieldProps, children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        ref: inputRef,
        ...inputProps,
        className: clsx(
          inputFieldClassNames.input,
          "py-8",
          "file:bg-primary file:text-on-primary file:border-none file:rounded file:text-sm file:font-semibold file:px-10 file:h-24 file:mr-10"
        )
      }
    ) });
  }
);
function FormFileField({ name, ...props }) {
  const {
    field: { onChange, onBlur, ref },
    fieldState: { invalid, error }
  } = useController({
    name
  });
  const [value, setValue] = React.useState("");
  const formProps = {
    onChange: (e) => {
      var _a2;
      onChange((_a2 = e.target.files) == null ? void 0 : _a2[0]);
      setValue(e.target.value);
    },
    onBlur,
    value,
    invalid,
    errorMessage: error == null ? void 0 : error.message
  };
  return /* @__PURE__ */ jsx(FileField, { ref, ...mergeProps(formProps, props) });
}
function ReportsSettings() {
  return /* @__PURE__ */ jsx(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Analytics" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Configure google analytics integration and credentials." }),
      children: /* @__PURE__ */ jsx(AnalyticsSection, {})
    }
  );
}
function AnalyticsSection() {
  const { clearErrors } = useFormContext();
  return /* @__PURE__ */ jsx(
    SettingsErrorGroup,
    {
      separatorTop: false,
      separatorBottom: false,
      name: "analytics_group",
      children: (isInvalid) => /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          FormFileField,
          {
            className: "mb-30",
            onChange: () => {
              clearErrors();
            },
            invalid: isInvalid,
            name: "files.certificate",
            accept: ".json",
            label: /* @__PURE__ */ jsx(Trans, { message: "Google service account key file (.json)" })
          }
        ),
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            className: "mb-30",
            onChange: () => {
              clearErrors();
            },
            invalid: isInvalid,
            name: "server.analytics_property_id",
            type: "number",
            label: /* @__PURE__ */ jsx(Trans, { message: "Google analytics property ID" })
          }
        ),
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            className: "mb-30",
            onChange: () => {
              clearErrors();
            },
            invalid: isInvalid,
            name: "client.analytics.tracking_code",
            placeholder: "G-******",
            min: "1",
            max: "20",
            description: /* @__PURE__ */ jsx(Trans, { message: "Google analytics measurement ID only, not the whole javascript snippet." }),
            label: /* @__PURE__ */ jsx(Trans, { message: "Google tag manager measurement ID" })
          }
        ),
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            name: "client.analytics.gchart_api_key",
            label: /* @__PURE__ */ jsx(Trans, { message: "Google maps javascript API key" }),
            description: /* @__PURE__ */ jsx(Trans, { message: "Only required in order to show world geochart on integrated analytics pages." })
          }
        )
      ] })
    }
  );
}
function useUpdateUser(form) {
  const navigate = useNavigate$1();
  return useMutation({
    mutationFn: (props) => updateUser(props),
    onSuccess: (response, props) => {
      toast(message("User updated"));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/admin/users");
    },
    onError: (r) => onFormQueryError(r, form)
  });
}
function updateUser({ id, ...other }) {
  if (other.roles) {
    other.roles = other.roles.map((r) => r.id);
  }
  return apiClient.put(`users/${id}`, other).then((r) => r.data);
}
function useStickySentinel() {
  const [isSticky, setIsSticky] = useState(false);
  const observerRef = useRef();
  const sentinelRef = useCallback((sentinel) => {
    var _a2;
    if (sentinel) {
      const observer = new IntersectionObserver(
        ([e]) => setIsSticky(e.intersectionRatio < 1),
        { threshold: [1] }
      );
      observerRef.current = observer;
      observer.observe(sentinel);
    } else if (observerRef.current) {
      (_a2 = observerRef.current) == null ? void 0 : _a2.disconnect();
    }
  }, []);
  return { isSticky, sentinelRef };
}
function CrupdateResourceLayout({
  onSubmit,
  form,
  title,
  subTitle,
  children,
  actions,
  backButton,
  isLoading = false,
  disableSaveWhenNotDirty = false,
  wrapInContainer = true
}) {
  const { isSticky, sentinelRef } = useStickySentinel();
  const isDirty = !disableSaveWhenNotDirty ? true : Object.keys(form.formState.dirtyFields).length;
  return /* @__PURE__ */ jsxs(
    Form$1,
    {
      onSubmit,
      onBeforeSubmit: () => form.clearErrors(),
      form,
      children: [
        /* @__PURE__ */ jsx("div", { ref: sentinelRef }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: clsx(
              "sticky top-0 z-10 my-12 transition-shadow md:my-24",
              isSticky && "bg shadow"
            ),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: clsx(
                  "flex items-center gap-24 py-14 md:items-start",
                  wrapInContainer && "container mx-auto px-24"
                ),
                children: [
                  backButton,
                  /* @__PURE__ */ jsxs("div", { className: "overflow-hidden overflow-ellipsis md:mr-64", children: [
                    /* @__PURE__ */ jsx("h1", { className: "overflow-hidden overflow-ellipsis whitespace-nowrap text-xl md:text-3xl", children: title }),
                    subTitle && /* @__PURE__ */ jsx("div", { className: "mt-4", children: subTitle })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "mr-auto" }),
                  actions,
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "flat",
                      color: "primary",
                      type: "submit",
                      disabled: isLoading || !isDirty,
                      children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
                    }
                  )
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: wrapInContainer ? "container mx-auto px-24 pb-24" : void 0,
            children: /* @__PURE__ */ jsx("div", { className: "rounded", children })
          }
        )
      ]
    }
  );
}
function CrupdateUserForm({
  onSubmit,
  form,
  title,
  subTitle,
  isLoading,
  avatarManager,
  resendEmailButton,
  children
}) {
  const { require_email_confirmation } = useSettings();
  const { data: valueLists } = useValueLists(["roles", "permissions"]);
  return /* @__PURE__ */ jsxs(
    CrupdateResourceLayout,
    {
      onSubmit,
      form,
      title,
      subTitle,
      isLoading,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-40 flex items-start gap-40 md:gap-80", children: [
          avatarManager,
          /* @__PURE__ */ jsxs("div", { className: "flex-auto", children: [
            children,
            /* @__PURE__ */ jsx(
              FormTextField,
              {
                className: "mb-30",
                name: "first_name",
                label: /* @__PURE__ */ jsx(Trans, { message: "First name" })
              }
            ),
            /* @__PURE__ */ jsx(
              FormTextField,
              {
                name: "last_name",
                label: /* @__PURE__ */ jsx(Trans, { message: "Last name" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-30 border-b border-t pb-30 pt-30", children: [
          /* @__PURE__ */ jsx(
            FormSwitch,
            {
              className: clsx(resendEmailButton && "mb-30"),
              disabled: !require_email_confirmation,
              name: "email_verified_at",
              description: /* @__PURE__ */ jsx(Trans, { message: "Whether email address has been confirmed. User will not be able to login until address is confirmed, unless confirmation is disabled from settings page." }),
              children: /* @__PURE__ */ jsx(Trans, { message: "Email confirmed" })
            }
          ),
          resendEmailButton
        ] }),
        /* @__PURE__ */ jsx(
          FormFileSizeField,
          {
            className: "mb-30",
            name: "available_space",
            label: /* @__PURE__ */ jsx(Trans, { message: "Allowed storage space" }),
            description: /* @__PURE__ */ jsx(
              Trans,
              {
                values: {
                  a: (parts) => /* @__PURE__ */ jsx(
                    Link,
                    {
                      className: LinkStyle,
                      target: "_blank",
                      to: "/admin/settings/uploading",
                      children: parts
                    }
                  )
                },
                message: "Total storage space all user uploads are allowed to take up. If left empty, this value will be inherited from any roles or subscriptions user has, or from 'Available space' setting in <a>Uploading</a> settings page."
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          FormChipField,
          {
            className: "mb-30",
            name: "roles",
            label: /* @__PURE__ */ jsx(Trans, { message: "Roles" }),
            suggestions: valueLists == null ? void 0 : valueLists.roles,
            children: (chip) => /* @__PURE__ */ jsx(Item, { value: chip.id, children: chip.name }, chip.id)
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-30 border-t pt-30", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-10 text-sm", children: /* @__PURE__ */ jsx(Trans, { message: "Permissions" }) }),
          /* @__PURE__ */ jsx(FormPermissionSelector, { name: "permissions" })
        ] })
      ]
    }
  );
}
const ReportIcon = createSvgIcon(
  [/* @__PURE__ */ jsx("path", { d: "M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM19 14.9 14.9 19H9.1L5 14.9V9.1L9.1 5h5.8L19 9.1v5.8z" }, "0"), /* @__PURE__ */ jsx("circle", { cx: "12", cy: "16", r: "1" }, "1"), /* @__PURE__ */ jsx("path", { d: "M11 7h2v7h-2z" }, "2")],
  "ReportOutlined"
);
function UpdateUserPage() {
  var _a2, _b, _c;
  const form = useForm();
  const { require_email_confirmation } = useSettings();
  const { userId } = useParams();
  const updateUser2 = useUpdateUser(form);
  const resendConfirmationEmail = useResendVerificationEmail();
  const { data, isLoading } = useUser(userId, {
    with: ["subscriptions", "roles", "permissions", "bans"]
  });
  const banReason = (_b = (_a2 = data == null ? void 0 : data.user.bans) == null ? void 0 : _a2[0]) == null ? void 0 : _b.comment;
  useEffect(() => {
    if ((data == null ? void 0 : data.user) && !form.getValues().id) {
      form.reset({
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        roles: data.user.roles,
        permissions: data.user.permissions,
        id: data.user.id,
        email_verified_at: Boolean(data.user.email_verified_at),
        available_space: data.user.available_space,
        avatar: data.user.avatar
      });
    }
  }, [data == null ? void 0 : data.user, form]);
  if (isLoading) {
    return /* @__PURE__ */ jsx(FullPageLoader, {});
  }
  const resendEmailButton = /* @__PURE__ */ jsx(
    Button,
    {
      size: "xs",
      variant: "outline",
      color: "primary",
      disabled: !require_email_confirmation || resendConfirmationEmail.isPending || ((_c = data == null ? void 0 : data.user) == null ? void 0 : _c.email_verified_at) != null,
      onClick: () => {
        resendConfirmationEmail.mutate({ email: data.user.email });
      },
      children: /* @__PURE__ */ jsx(Trans, { message: "Resend email" })
    }
  );
  return /* @__PURE__ */ jsx(
    CrupdateUserForm,
    {
      onSubmit: (newValues) => {
        updateUser2.mutate(newValues);
      },
      form,
      title: /* @__PURE__ */ jsx(Trans, { values: { email: data == null ? void 0 : data.user.email }, message: "Edit “:email“" }),
      subTitle: banReason && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-danger", children: [
        /* @__PURE__ */ jsx(ReportIcon, {}),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Trans,
          {
            message: "Suspended: :reason",
            values: { reason: banReason }
          }
        ) })
      ] }),
      isLoading: updateUser2.isPending,
      avatarManager: /* @__PURE__ */ jsx(
        AvatarSection,
        {
          user: data.user,
          onChange: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
          }
        }
      ),
      resendEmailButton,
      children: /* @__PURE__ */ jsx(
        FormTextField,
        {
          className: "mb-30",
          name: "password",
          type: "password",
          label: /* @__PURE__ */ jsx(Trans, { message: "New password" })
        }
      )
    }
  );
}
function AvatarSection({ user, onChange }) {
  const uploadAvatar = useUploadAvatar({ user });
  const removeAvatar = useRemoveAvatar({ user });
  return /* @__PURE__ */ jsx(FileUploadProvider, { children: /* @__PURE__ */ jsx(
    FormImageSelector,
    {
      name: "avatar",
      diskPrefix: "avatars",
      variant: "avatar",
      stretchPreview: true,
      label: /* @__PURE__ */ jsx(Trans, { message: "Profile image" }),
      previewSize: "w-90 h-90",
      showRemoveButton: true,
      onChange: (url) => {
        if (url) {
          uploadAvatar.mutate({ url });
        } else {
          removeAvatar.mutate();
        }
        onChange();
      }
    }
  ) });
}
function useCreateUser(form) {
  const navigate = useNavigate$1();
  return useMutation({
    mutationFn: (props) => createUser(props),
    onSuccess: () => {
      toast(message("User created"));
      queryClient.invalidateQueries({ queryKey: DatatableDataQueryKey("users") });
      navigate("/admin/users");
    },
    onError: (r) => onFormQueryError(r, form)
  });
}
function createUser(payload) {
  if (payload.roles) {
    payload.roles = payload.roles.map((r) => r.id);
  }
  return apiClient.post("users", payload).then((r) => r.data);
}
function CreateUserPage() {
  const form = useForm();
  const createUser2 = useCreateUser(form);
  const avatarManager = /* @__PURE__ */ jsx(FileUploadProvider, { children: /* @__PURE__ */ jsx(
    FormImageSelector,
    {
      name: "avatar",
      diskPrefix: "avatars",
      variant: "avatar",
      stretchPreview: true,
      label: /* @__PURE__ */ jsx(Trans, { message: "Profile image" }),
      previewSize: "w-90 h-90",
      showRemoveButton: true
    }
  ) });
  return /* @__PURE__ */ jsxs(
    CrupdateUserForm,
    {
      onSubmit: (newValues) => {
        createUser2.mutate(newValues);
      },
      form,
      title: /* @__PURE__ */ jsx(Trans, { message: "Add new user" }),
      isLoading: createUser2.isPending,
      avatarManager,
      children: [
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            className: "mb-30",
            name: "email",
            type: "email",
            label: /* @__PURE__ */ jsx(Trans, { message: "Email" })
          }
        ),
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            className: "mb-30",
            name: "password",
            type: "password",
            label: /* @__PURE__ */ jsx(Trans, { message: "Password" })
          }
        )
      ]
    }
  );
}
const TranslateIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "m12.87 15.07-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7 1.62-4.33L19.12 17h-3.24z" }),
  "TranslateOutlined"
);
const getLocalWithLinesQueryKey = (localeId) => {
  const key = ["getLocaleWithLines"];
  if (localeId != null) {
    key.push(localeId);
  }
  return key;
};
function useLocaleWithLines(localeId) {
  return useQuery({
    queryKey: getLocalWithLinesQueryKey(localeId),
    queryFn: () => fetchLocaleWithLines(localeId),
    staleTime: Infinity
  });
}
function fetchLocaleWithLines(localeId) {
  return apiClient.get(`localizations/${localeId}`).then((response) => response.data);
}
function UpdateLocalization({
  id,
  ...other
}) {
  return apiClient.put(`localizations/${id}`, other).then((r) => r.data);
}
function useUpdateLocalization(form) {
  return useMutation({
    mutationFn: (props) => UpdateLocalization(props),
    onSuccess: () => {
      toast(message("Localization updated"));
      queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey("localizations")
      });
      queryClient.invalidateQueries({ queryKey: getLocalWithLinesQueryKey() });
    },
    onError: (r) => form ? onFormQueryError(r, form) : showHttpErrorToast(r)
  });
}
function UpdateLocalizationDialog({
  localization
}) {
  const { trans } = useTrans();
  const { formId, close } = useDialogContext();
  const form = useForm({
    defaultValues: {
      id: localization.id,
      name: localization.name,
      language: localization.language
    }
  });
  const { data } = useValueLists(["languages"]);
  const languages = (data == null ? void 0 : data.languages) || [];
  const updateLocalization = useUpdateLocalization(form);
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Update localization" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsxs(
      Form$1,
      {
        form,
        id: formId,
        onSubmit: (values) => {
          updateLocalization.mutate(values, { onSuccess: close });
        },
        children: [
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              name: "name",
              label: /* @__PURE__ */ jsx(Trans, { message: "Name" }),
              className: "mb-30",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(
            FormSelect,
            {
              required: true,
              name: "language",
              label: /* @__PURE__ */ jsx(Trans, { message: "Language" }),
              selectionMode: "single",
              showSearchField: true,
              searchPlaceholder: trans(message("Search languages")),
              children: languages.map((language) => /* @__PURE__ */ jsx(Item, { value: language.code, children: language.name }, language.code))
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: close, children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          type: "submit",
          form: formId,
          disabled: updateLocalization.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
        }
      )
    ] })
  ] });
}
function createLocalization(payload) {
  return apiClient.post(`localizations`, payload).then((r) => r.data);
}
function useCreateLocalization(form) {
  const queryClient2 = useQueryClient();
  return useMutation({
    mutationFn: (props) => createLocalization(props),
    onSuccess: () => {
      toast(message("Localization created"));
      queryClient2.invalidateQueries({
        queryKey: DatatableDataQueryKey("localizations")
      });
    },
    onError: (r) => onFormQueryError(r, form)
  });
}
function CreateLocationDialog() {
  const { trans } = useTrans();
  const { formId, close } = useDialogContext();
  const form = useForm({
    defaultValues: {
      language: "en"
    }
  });
  const { data } = useValueLists(["languages"]);
  const languages = (data == null ? void 0 : data.languages) || [];
  const createLocalization2 = useCreateLocalization(form);
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Create localization" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsxs(
      Form$1,
      {
        form,
        id: formId,
        onSubmit: (values) => {
          createLocalization2.mutate(values, { onSuccess: close });
        },
        children: [
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              autoFocus: true,
              name: "name",
              label: /* @__PURE__ */ jsx(Trans, { message: "Name" }),
              className: "mb-30",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(
            FormSelect,
            {
              required: true,
              name: "language",
              label: /* @__PURE__ */ jsx(Trans, { message: "Language" }),
              selectionMode: "single",
              showSearchField: true,
              searchPlaceholder: trans(message("Search languages")),
              children: languages.map((language) => /* @__PURE__ */ jsx(Item, { value: language.code, children: language.name }, language.code))
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: close, children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          type: "submit",
          form: formId,
          disabled: createLocalization2.isPending,
          children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
        }
      )
    ] })
  ] });
}
const aroundTheWorldSvg = "/assets/around-the-world-df9b11c5.svg";
function useUploadTranslationFile() {
  return useMutation({
    mutationFn: (payload) => uploadFile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey("localizations")
      });
      await queryClient.invalidateQueries({
        queryKey: getLocalWithLinesQueryKey()
      });
      toast(message("Translation file uploaded"));
    },
    onError: (r) => showHttpErrorToast(r)
  });
}
function uploadFile({ localeId, file }) {
  const data = new FormData();
  data.append("file", file.native);
  return apiClient.post(`localizations/${localeId}/upload`, data).then((r) => r.data);
}
const columnConfig$5 = [
  {
    key: "name",
    allowsSorting: true,
    sortingKey: "name",
    visibleInMode: "all",
    width: "flex-3 min-w-200",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Name" }),
    body: (locale) => locale.name
  },
  {
    key: "language",
    allowsSorting: true,
    sortingKey: "language",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Language code" }),
    body: (locale) => locale.language
  },
  {
    key: "updatedAt",
    allowsSorting: true,
    width: "w-100",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Last updated" }),
    body: (locale) => /* @__PURE__ */ jsx(FormattedDate, { date: locale.updated_at })
  },
  {
    key: "actions",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    hideHeader: true,
    align: "end",
    width: "w-84 flex-shrink-0",
    visibleInMode: "all",
    body: (locale) => {
      return /* @__PURE__ */ jsxs("div", { className: "text-muted", children: [
        /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Translate" }), children: /* @__PURE__ */ jsx(
          IconButton,
          {
            size: "md",
            elementType: Link,
            to: `${locale.id}/translate`,
            children: /* @__PURE__ */ jsx(TranslateIcon, {})
          }
        ) }),
        /* @__PURE__ */ jsx(FileUploadProvider, { children: /* @__PURE__ */ jsx(RowActionsMenuTrigger, { locale }) })
      ] });
    }
  }
];
function LocalizationIndex() {
  return /* @__PURE__ */ jsx(
    DataTablePage,
    {
      endpoint: "localizations",
      title: /* @__PURE__ */ jsx(Trans, { message: "Localizations" }),
      columns: columnConfig$5,
      actions: /* @__PURE__ */ jsx(Actions$6, {}),
      selectedActions: /* @__PURE__ */ jsx(DeleteSelectedItemsAction, {}),
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: aroundTheWorldSvg,
          title: /* @__PURE__ */ jsx(Trans, { message: "No localizations have been created yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching localizations" })
        }
      )
    }
  );
}
function Actions$6() {
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
    /* @__PURE__ */ jsx(DataTableAddItemButton, { children: /* @__PURE__ */ jsx(Trans, { message: "Add new localization" }) }),
    /* @__PURE__ */ jsx(CreateLocationDialog, {})
  ] }) });
}
function RowActionsMenuTrigger({ locale }) {
  const uploadFile2 = useUploadTranslationFile();
  return /* @__PURE__ */ jsxs(MenuTrigger, { children: [
    /* @__PURE__ */ jsx(IconButton, { disabled: uploadFile2.isPending, children: /* @__PURE__ */ jsx(MoreVertIcon, {}) }),
    /* @__PURE__ */ jsxs(Menu, { children: [
      /* @__PURE__ */ jsx(
        Item,
        {
          value: "translate",
          elementType: Link,
          to: `${locale.id}/translate`,
          children: /* @__PURE__ */ jsx(Trans, { message: "Translate" })
        }
      ),
      /* @__PURE__ */ jsx(
        Item,
        {
          value: "rename",
          onSelected: () => openDialog(UpdateLocalizationDialog, { localization: locale }),
          children: /* @__PURE__ */ jsx(Trans, { message: "Rename" })
        }
      ),
      /* @__PURE__ */ jsx(
        Item,
        {
          value: "download",
          onSelected: () => downloadFileFromUrl(`api/v1/localizations/${locale.id}/download`),
          children: /* @__PURE__ */ jsx(Trans, { message: "Download" })
        }
      ),
      /* @__PURE__ */ jsx(
        Item,
        {
          value: "upload",
          onSelected: async () => {
            const files = await openUploadWindow({
              types: [UploadInputType.json]
            });
            if (files.length == 1) {
              uploadFile2.mutate({ localeId: locale.id, file: files[0] });
            }
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Upload" })
        }
      )
    ] })
  ] });
}
function NewTranslationDialog() {
  const { formId, close } = useDialogContext();
  const form = useForm();
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Add translation" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsxs(
      Form$1,
      {
        form,
        id: formId,
        onSubmit: (values) => {
          close(values);
        },
        children: [
          /* @__PURE__ */ jsx(
            SectionHelper,
            {
              className: "mb-30",
              title: /* @__PURE__ */ jsx(Trans, { message: "Add a new translation, if it does not exist already." }),
              description: /* @__PURE__ */ jsx(Trans, { message: "This should only need to be done for things like custom menu items." })
            }
          ),
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              inputElementType: "textarea",
              rows: 2,
              autoFocus: true,
              name: "key",
              label: /* @__PURE__ */ jsx(Trans, { message: "Translation key" }),
              className: "mb-30",
              required: true
            }
          ),
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              inputElementType: "textarea",
              rows: 2,
              name: "value",
              label: /* @__PURE__ */ jsx(Trans, { message: "Translation value" }),
              required: true
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: close, children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(Button, { variant: "flat", color: "primary", type: "submit", form: formId, children: /* @__PURE__ */ jsx(Trans, { message: "Add" }) })
    ] })
  ] });
}
function TranslationManagementPage() {
  const { localeId } = useParams();
  const { data, isLoading } = useLocaleWithLines(localeId);
  const localization = data == null ? void 0 : data.localization;
  if (isLoading || !localization) {
    return /* @__PURE__ */ jsx(FullPageLoader, {});
  }
  return /* @__PURE__ */ jsx(Form, { localization });
}
function Form({ localization }) {
  const [lines, setLines] = useState(localization.lines || {});
  const navigate = useNavigate$1();
  const updateLocalization = useUpdateLocalization();
  const [searchQuery, setSearchQuery] = useState("");
  return /* @__PURE__ */ jsxs(
    "form",
    {
      className: "flex h-full flex-col p-14 md:p-24",
      onSubmit: (e) => {
        e.preventDefault();
        updateLocalization.mutate(
          { id: localization.id, lines },
          {
            onSuccess: () => {
              navigate("/admin/localizations");
            }
          }
        );
      },
      children: [
        /* @__PURE__ */ jsx(
          Header$1,
          {
            localization,
            setLines,
            lines,
            searchQuery,
            setSearchQuery,
            isLoading: updateLocalization.isPending
          }
        ),
        /* @__PURE__ */ jsx(LinesList, { lines, setLines, searchQuery })
      ]
    }
  );
}
function Header$1({
  localization,
  searchQuery,
  setSearchQuery,
  isLoading,
  lines,
  setLines
}) {
  const navigate = useNavigate$1();
  const isMobile = useIsMobileMediaQuery();
  const { trans } = useTrans();
  return /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0", children: [
    /* @__PURE__ */ jsxs(Breadcrumb, { size: "lg", className: "mb-16", children: [
      /* @__PURE__ */ jsx(
        BreadcrumbItem,
        {
          onSelected: () => {
            navigate("/admin/localizations");
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Localizations" })
        }
      ),
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(
        Trans,
        {
          message: ":locale translations",
          values: { locale: localization.name }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-24 flex items-center gap-32 md:gap-12", children: [
      /* @__PURE__ */ jsx("div", { className: "max-w-440 flex-auto", children: /* @__PURE__ */ jsx(
        TextField,
        {
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          startAdornment: /* @__PURE__ */ jsx(SearchIcon, {}),
          placeholder: trans({ message: "Type to search..." })
        }
      ) }),
      /* @__PURE__ */ jsxs(
        DialogTrigger,
        {
          type: "modal",
          onClose: (newTranslation) => {
            if (newTranslation) {
              const newLines = { ...lines };
              newLines[newTranslation.key] = newTranslation.value;
              setLines(newLines);
            }
          },
          children: [
            !isMobile && /* @__PURE__ */ jsx(
              Button,
              {
                className: "ml-auto",
                variant: "outline",
                color: "primary",
                startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
                children: /* @__PURE__ */ jsx(Trans, { message: "Add new" })
              }
            ),
            /* @__PURE__ */ jsx(NewTranslationDialog, {})
          ]
        }
      ),
      /* @__PURE__ */ jsx(ActionsMenuTrigger, { locale: localization }),
      /* @__PURE__ */ jsx(
        Button,
        {
          variant: "flat",
          color: "primary",
          type: "submit",
          disabled: isLoading,
          children: isMobile ? /* @__PURE__ */ jsx(Trans, { message: "Save" }) : /* @__PURE__ */ jsx(Trans, { message: "Save translations" })
        }
      )
    ] })
  ] });
}
function LinesList({ searchQuery, lines, setLines }) {
  const filteredLines = useMemo(() => {
    return Object.entries(lines).filter(([id, translation]) => {
      const lowerCaseQuery = searchQuery == null ? void 0 : searchQuery.toLowerCase();
      return !lowerCaseQuery || (id == null ? void 0 : id.toLowerCase().includes(lowerCaseQuery)) || (translation == null ? void 0 : translation.toLowerCase().includes(lowerCaseQuery));
    });
  }, [lines, searchQuery]);
  const ref = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredLines.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 123
  });
  return /* @__PURE__ */ jsx("div", { className: "flex-auto overflow-y-auto", ref, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "relative w-full",
      style: {
        height: `${rowVirtualizer.getTotalSize()}px`
      },
      children: rowVirtualizer.getVirtualItems().map((virtualItem) => {
        const [id, translation] = filteredLines[virtualItem.index];
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute left-0 top-0 w-full",
            style: {
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            },
            children: /* @__PURE__ */ jsxs("div", { className: "mb-10 rounded border md:mr-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-24 border-b px-10 py-2", children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "flex-auto text-xs font-semibold",
                    htmlFor: id,
                    children: id
                  }
                ),
                /* @__PURE__ */ jsx(
                  IconButton,
                  {
                    size: "xs",
                    className: "text-muted",
                    onClick: () => {
                      const newLines = { ...lines };
                      delete newLines[id];
                      setLines(newLines);
                    },
                    children: /* @__PURE__ */ jsx(CloseIcon, {})
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                "textarea",
                {
                  id,
                  name: id,
                  defaultValue: translation,
                  className: "block w-full resize-none rounded bg-inherit p-10 text-sm outline-none focus-visible:ring-2",
                  rows: 2,
                  onChange: (e) => {
                    const newLines = { ...lines };
                    newLines[id] = e.target.value;
                    setLines(newLines);
                  }
                }
              ) })
            ] })
          },
          id
        );
      })
    }
  ) });
}
function ActionsMenuTrigger({ locale }) {
  const uploadFile2 = useUploadTranslationFile();
  return /* @__PURE__ */ jsxs(MenuTrigger, { children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        variant: "outline",
        size: "sm",
        color: "primary",
        disabled: uploadFile2.isPending,
        children: /* @__PURE__ */ jsx(MoreVertIcon, {})
      }
    ),
    /* @__PURE__ */ jsxs(Menu, { children: [
      /* @__PURE__ */ jsx(
        Item,
        {
          value: "download",
          onSelected: () => downloadFileFromUrl(`api/v1/localizations/${locale.id}/download`),
          children: /* @__PURE__ */ jsx(Trans, { message: "Download" })
        }
      ),
      /* @__PURE__ */ jsx(
        Item,
        {
          value: "upload",
          onSelected: async () => {
            const files = await openUploadWindow({
              types: [UploadInputType.json]
            });
            if (files.length == 1) {
              uploadFile2.mutate({ localeId: locale.id, file: files[0] });
            }
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Upload" })
        }
      )
    ] })
  ] });
}
function ImageZoomDialog(props) {
  const { close } = useDialogContext();
  const { image, images } = props;
  const [activeIndex, setActiveIndex] = useControlledState(
    props.activeIndex,
    props.defaultActiveIndex,
    props.onActiveIndexChange
  );
  const src = image || (images == null ? void 0 : images[activeIndex]);
  return /* @__PURE__ */ jsx(Dialog, { size: "fullscreenTakeover", background: "bg-black/80", children: /* @__PURE__ */ jsxs(DialogBody, { padding: "p-0", className: "h-full w-full", children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "lg",
        color: "paper",
        className: "absolute right-0 top-0 z-20 text-white",
        onClick: () => {
          close();
        },
        children: /* @__PURE__ */ jsx(CloseIcon, {})
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex h-full w-full items-center justify-center p-40", children: [
      (images == null ? void 0 : images.length) ? /* @__PURE__ */ jsx(
        IconButton,
        {
          size: "lg",
          color: "white",
          variant: "flat",
          className: "absolute bottom-0 left-20 top-0 my-auto",
          disabled: activeIndex < 1,
          onClick: () => {
            setActiveIndex(activeIndex - 1);
          },
          children: /* @__PURE__ */ jsx(KeyboardArrowLeftIcon, {})
        }
      ) : null,
      /* @__PURE__ */ jsx(
        "img",
        {
          src,
          alt: "",
          className: "max-h-full w-auto object-contain shadow"
        }
      ),
      (images == null ? void 0 : images.length) ? /* @__PURE__ */ jsx(
        IconButton,
        {
          size: "lg",
          color: "white",
          variant: "flat",
          className: "absolute bottom-0 right-20 top-0 my-auto",
          disabled: activeIndex + 1 === (images == null ? void 0 : images.length),
          onClick: () => {
            setActiveIndex(activeIndex + 1);
          },
          children: /* @__PURE__ */ jsx(KeyboardArrowRightIcon, {})
        }
      ) : null
    ] })
  ] }) });
}
function AdsPage() {
  var _a2;
  const query = useAdminSettings();
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-12 md:p-24", children: [
    /* @__PURE__ */ jsx(StaticPageTitle, { children: /* @__PURE__ */ jsx(Trans, { message: "Ads" }) }),
    /* @__PURE__ */ jsx("h1", { className: "mb-20 text-2xl font-light md:mb-40 md:text-3xl", children: /* @__PURE__ */ jsx(Trans, { message: "Predefined Ad slots" }) }),
    query.isLoading ? /* @__PURE__ */ jsx(ProgressCircle, { isIndeterminate: true }) : /* @__PURE__ */ jsx(AdsForm, { defaultValues: ((_a2 = query.data) == null ? void 0 : _a2.client.ads) || {} })
  ] });
}
function AdsForm({ defaultValues }) {
  const {
    admin: { ads }
  } = useContext(SiteConfigContext);
  const form = useForm({
    defaultValues: { client: { ads: defaultValues } }
  });
  const updateSettings = useUpdateAdminSettings(form);
  return /* @__PURE__ */ jsxs(
    Form$1,
    {
      form,
      onSubmit: (value) => {
        updateSettings.mutate(value);
      },
      children: [
        ads.map((ad) => {
          return /* @__PURE__ */ jsx(AdSection, { adConfig: ad }, ad.slot);
        }),
        /* @__PURE__ */ jsx(
          FormSwitch,
          {
            name: "client.ads.disable",
            className: "mb-30",
            description: /* @__PURE__ */ jsx(Trans, { message: "Disable all add related functionality across the site." }),
            children: /* @__PURE__ */ jsx(Trans, { message: "Disable ads" })
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            variant: "flat",
            color: "primary",
            disabled: updateSettings.isPending,
            children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
          }
        )
      ]
    }
  );
}
function AdSection({ adConfig }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-24", children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        className: "mb-30 flex-auto",
        name: `client.${adConfig.slot}`,
        inputElementType: "textarea",
        rows: 8,
        label: /* @__PURE__ */ jsx(Trans, { ...adConfig.description })
      }
    ),
    /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "cursor-zoom-in overflow-hidden rounded outline-none transition hover:scale-105 focus-visible:ring max-md:hidden",
          children: /* @__PURE__ */ jsx(
            "img",
            {
              src: adConfig.image,
              className: "h-[186px] w-auto border",
              alt: "Ad slot example"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(ImageZoomDialog, { image: adConfig.image })
    ] })
  ] });
}
function SectionList() {
  const sections = useAppearanceStore((s) => {
    var _a2;
    return (_a2 = s.config) == null ? void 0 : _a2.sections;
  });
  const sortedSection = useMemo(() => {
    if (!sections)
      return [];
    return Object.entries(sections || []).map(([key, value]) => {
      return {
        ...value,
        key
      };
    }).sort((a, b) => ((a == null ? void 0 : a.position) || 1) - ((b == null ? void 0 : b.position) || 1));
  }, [sections]);
  return /* @__PURE__ */ jsx(Fragment, { children: sortedSection.map((section) => {
    return /* @__PURE__ */ jsx(
      AppearanceButton,
      {
        to: section.key,
        elementType: NavLink,
        children: /* @__PURE__ */ jsx(Trans, { ...section.label })
      },
      section.key
    );
  }) });
}
const RoleIndexPageFilters = [
  {
    key: "type",
    label: message("Type"),
    description: message("Type of the role"),
    defaultOperator: FilterOperator.ne,
    control: {
      type: FilterControlType.Select,
      defaultValue: "01",
      options: [
        {
          key: "01",
          label: message("Sitewide"),
          value: "sitewide"
        },
        {
          key: "02",
          label: message("Workspace"),
          value: "workspace"
        }
      ]
    }
  },
  createdAtFilter({
    description: message("Date role was created")
  }),
  updatedAtFilter({
    description: message("Date role was last updated")
  })
];
const columnConfig$4 = [
  {
    key: "name",
    allowsSorting: true,
    visibleInMode: "all",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Role" }),
    body: (role) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Trans, { message: role.name }) }),
      /* @__PURE__ */ jsx("div", { className: "text-muted text-xs overflow-x-hidden overflow-ellipsis", children: role.description ? /* @__PURE__ */ jsx(Trans, { message: role.description }) : void 0 })
    ] })
  },
  {
    key: "type",
    maxWidth: "max-w-100",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Type" }),
    body: (role) => /* @__PURE__ */ jsx(Trans, { message: role.type })
  },
  {
    key: "updated_at",
    maxWidth: "max-w-100",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Last updated" }),
    body: (role) => /* @__PURE__ */ jsx(FormattedDate, { date: role.updated_at })
  },
  {
    key: "actions",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    hideHeader: true,
    visibleInMode: "all",
    align: "end",
    width: "w-42 flex-shrink-0",
    body: (role) => {
      return /* @__PURE__ */ jsx(Link, { to: `${role.id}/edit`, children: /* @__PURE__ */ jsx(IconButton, { size: "md", className: "text-muted", children: /* @__PURE__ */ jsx(EditIcon, {}) }) });
    }
  }
];
function RolesIndexPage() {
  return /* @__PURE__ */ jsx(
    DataTablePage,
    {
      endpoint: "roles",
      title: /* @__PURE__ */ jsx(Trans, { message: "Roles" }),
      columns: columnConfig$4,
      filters: RoleIndexPageFilters,
      actions: /* @__PURE__ */ jsx(Actions$5, {}),
      selectedActions: /* @__PURE__ */ jsx(DeleteSelectedItemsAction, {}),
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: teamSvg,
          title: /* @__PURE__ */ jsx(Trans, { message: "No roles have been created yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching roles" })
        }
      )
    }
  );
}
function Actions$5() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(DataTableExportCsvButton, { endpoint: "roles/csv/export" }),
    /* @__PURE__ */ jsx(DataTableAddItemButton, { elementType: Link, to: "new", children: /* @__PURE__ */ jsx(Trans, { message: "Add new role" }) })
  ] });
}
const Endpoint$4 = (id) => `roles/${id}`;
function useRole() {
  const { roleId } = useParams();
  return useQuery({
    queryKey: [Endpoint$4(roleId)],
    queryFn: () => fetchRole(roleId)
  });
}
function fetchRole(roleId) {
  return apiClient.get(Endpoint$4(roleId)).then((response) => response.data);
}
const Endpoint$3 = (id) => `roles/${id}`;
function useUpdateRole() {
  const { trans } = useTrans();
  const navigate = useNavigate$1();
  return useMutation({
    mutationFn: (payload) => updateRole(payload),
    onSuccess: (response) => {
      toast(trans(message("Role updated")));
      queryClient.invalidateQueries({ queryKey: [Endpoint$3(response.role.id)] });
      queryClient.invalidateQueries({ queryKey: DatatableDataQueryKey("roles") });
      navigate("/admin/roles");
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function updateRole({ id, ...payload }) {
  return apiClient.put(Endpoint$3(id), payload).then((r) => r.data);
}
function CrupdateRolePageSettingsPanel({
  isInternal = false
}) {
  const { trans } = useTrans();
  const { workspaces } = useSettings();
  const { watch } = useFormContext();
  const watchedType = watch("type");
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Name" }),
        name: "name",
        className: "mb-20",
        required: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Description" }),
        name: "description",
        inputElementType: "textarea",
        placeholder: trans(message("Role description...")),
        rows: 4,
        className: "mb-20"
      }
    ),
    workspaces.integrated && /* @__PURE__ */ jsxs(
      FormSelect,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Type" }),
        name: "type",
        selectionMode: "single",
        className: "mb-20",
        description: /* @__PURE__ */ jsx(Trans, { message: "Whether this role will be assigned to users globally on the site or only within workspaces." }),
        children: [
          /* @__PURE__ */ jsx(Item, { value: "sitewide", children: /* @__PURE__ */ jsx(Trans, { message: "Sitewide" }) }),
          /* @__PURE__ */ jsx(Item, { value: "workspace", children: /* @__PURE__ */ jsx(Trans, { message: "Workspace" }) })
        ]
      }
    ),
    !isInternal && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      /* @__PURE__ */ jsx(
        FormSwitch,
        {
          name: "default",
          className: "mb-20",
          description: /* @__PURE__ */ jsx(Trans, { message: "Assign this role to new users automatically." }),
          children: /* @__PURE__ */ jsx(Trans, { message: "Default" })
        }
      ),
      watchedType === "sitewide" && /* @__PURE__ */ jsx(
        FormSwitch,
        {
          name: "guests",
          description: /* @__PURE__ */ jsx(Trans, { message: "Assign this role to guests (not logged in users)." }),
          children: /* @__PURE__ */ jsx(Trans, { message: "Guests" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "mb-10 mt-30 text-lg", children: /* @__PURE__ */ jsx(Trans, { message: "Permissions" }) }),
    /* @__PURE__ */ jsx(
      FormPermissionSelector,
      {
        name: "permissions",
        valueListKey: watchedType === "sitewide" ? "permissions" : "workspacePermissions"
      }
    )
  ] });
}
function SelectUserDialog({ onUserSelected }) {
  var _a2;
  const { close } = useDialogContext();
  const [searchTerm, setSearchTerm] = useState("");
  const { trans } = useTrans();
  const query = useNormalizedModels("normalized-models/user", {
    query: searchTerm,
    perPage: 14
  });
  const users = ((_a2 = query.data) == null ? void 0 : _a2.results) || [];
  const emptyStateMessage = /* @__PURE__ */ jsx(
    IllustratedMessage,
    {
      className: "pt-20",
      size: "sm",
      title: /* @__PURE__ */ jsx(Trans, { message: "No matching users" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Try another search query" }),
      image: /* @__PURE__ */ jsx(SvgImage, { src: teamSvg })
    }
  );
  const selectUser = (user) => {
    close();
    onUserSelected(user);
  };
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Select a user" }) }),
    /* @__PURE__ */ jsxs(DialogBody, { children: [
      /* @__PURE__ */ jsx(
        TextField,
        {
          autoFocus: true,
          className: "mb-20",
          startAdornment: /* @__PURE__ */ jsx(SearchIcon, {}),
          placeholder: trans(message("Search for user by name or email")),
          value: searchTerm,
          onChange: (e) => {
            setSearchTerm(e.target.value);
          }
        }
      ),
      !query.isLoading && !users.length && emptyStateMessage,
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-x-10", children: users.map((user) => /* @__PURE__ */ jsx(
        UserListItem,
        {
          user,
          onUserSelected: selectUser
        },
        user.id
      )) })
    ] })
  ] });
}
function UserListItem({ user, onUserSelected }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex items-center gap-10 rounded p-10 outline-none ring-offset-4 hover:bg-hover focus-visible:ring",
      role: "button",
      tabIndex: 0,
      onClick: () => {
        onUserSelected(user);
      },
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onUserSelected(user);
        }
      },
      children: [
        /* @__PURE__ */ jsx(Avatar, { src: user.image }),
        /* @__PURE__ */ jsxs("div", { className: "overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden text-ellipsis", children: user.name }),
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden text-ellipsis text-muted", children: user.description })
        ] })
      ]
    },
    user.id
  );
}
function useRemoveUsersFromRole(role) {
  return useMutation({
    mutationFn: ({ userIds }) => removeUsersFromRole({ userIds, roleId: role.id }),
    onSuccess: (response, payload) => {
      toast(
        message("Removed [one 1 user|other :count users] from “{role}“", {
          values: { count: payload.userIds.length, role: role.name }
        })
      );
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function removeUsersFromRole({
  roleId,
  userIds
}) {
  return apiClient.post(`roles/${roleId}/remove-users`, { userIds }).then((r) => r.data);
}
function useAddUsersToRole(role) {
  return useMutation({
    mutationFn: ({ userIds }) => addUsersToRole({ userIds, roleId: role.id }),
    onSuccess: (response, payload) => {
      toast(
        message("Assigned [one 1 user|other :count users] to {role}", {
          values: { count: payload.userIds.length, role: role.name }
        })
      );
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function addUsersToRole({
  roleId,
  userIds
}) {
  return apiClient.post(`roles/${roleId}/add-users`, { userIds }).then((r) => r.data);
}
const userColumn = {
  key: "name",
  allowsSorting: true,
  sortingKey: "email",
  header: () => /* @__PURE__ */ jsx(Trans, { message: "User" }),
  body: (user) => /* @__PURE__ */ jsx(
    NameWithAvatar,
    {
      image: user.avatar,
      label: user.display_name,
      description: user.email
    }
  ),
  width: "col-w-3"
};
const desktopColumns = [
  userColumn,
  {
    key: "first_name",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "First name" }),
    body: (user) => user.first_name
  },
  {
    key: "last_name",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Last name" }),
    body: (user) => user.last_name
  },
  {
    key: "created_at",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Assigned at" }),
    body: (user) => /* @__PURE__ */ jsx(FormattedDate, { date: user.created_at })
  }
];
const mobileColumns = [userColumn];
function EditRolePageUsersPanel({
  role
}) {
  const isMobile = useIsMobileMediaQuery();
  if (role.guests || role.type === "workspace") {
    return /* @__PURE__ */ jsx("div", { className: "pt-30 pb-10", children: /* @__PURE__ */ jsx(
      DataTableEmptyStateMessage,
      {
        image: teamSvg,
        title: /* @__PURE__ */ jsx(Trans, { message: "Users can't be assigned to this role" })
      }
    ) });
  }
  return /* @__PURE__ */ jsx(
    DataTable,
    {
      endpoint: "users",
      columns: isMobile ? mobileColumns : desktopColumns,
      queryParams: { roleId: `${role.id}` },
      actions: /* @__PURE__ */ jsx(AssignUserAction, { role }),
      selectedActions: /* @__PURE__ */ jsx(RemoveUsersAction, { role }),
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: teamSvg,
          title: /* @__PURE__ */ jsx(Trans, { message: "No users have been assigned to this role yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching users" })
        }
      )
    }
  );
}
function AssignUserAction({ role }) {
  const addUsers = useAddUsersToRole(role);
  return /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
    /* @__PURE__ */ jsx(Button, { variant: "flat", color: "primary", disabled: addUsers.isPending, children: /* @__PURE__ */ jsx(Trans, { message: "Assign user" }) }),
    /* @__PURE__ */ jsx(
      SelectUserDialog,
      {
        onUserSelected: (user) => {
          addUsers.mutate(
            { userIds: [user.id] },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: DatatableDataQueryKey("users", {
                    roleId: `${role.id}`
                  })
                });
              }
            }
          );
        }
      }
    )
  ] });
}
function RemoveUsersAction({ role }) {
  const removeUsers = useRemoveUsersFromRole(role);
  const { selectedRows } = useDataTable();
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (isConfirmed) => {
        if (isConfirmed) {
          removeUsers.mutate(
            { userIds: selectedRows },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: DatatableDataQueryKey("users", {
                    roleId: `${role.id}`
                  })
                });
              }
            }
          );
        }
      },
      children: [
        /* @__PURE__ */ jsx(Button, { variant: "flat", color: "danger", disabled: removeUsers.isPending, children: /* @__PURE__ */ jsx(Trans, { message: "Remove users" }) }),
        /* @__PURE__ */ jsx(
          ConfirmationDialog,
          {
            title: /* @__PURE__ */ jsx(
              Trans,
              {
                message: "Remove [one 1 user|other :count users] from “:name“ role?",
                values: { count: selectedRows.length, name: role.name }
              }
            ),
            body: /* @__PURE__ */ jsx(Trans, { message: "This will permanently remove the users." }),
            confirm: /* @__PURE__ */ jsx(Trans, { message: "Remove" }),
            isDanger: true
          }
        )
      ]
    }
  );
}
function EditRolePage() {
  const query = useRole();
  if (query.status !== "success") {
    return /* @__PURE__ */ jsx(FullPageLoader, {});
  }
  return /* @__PURE__ */ jsx(PageContent$2, { role: query.data.role });
}
function PageContent$2({ role }) {
  const form = useForm({ defaultValues: role });
  const updateRole2 = useUpdateRole();
  return /* @__PURE__ */ jsx(
    CrupdateResourceLayout,
    {
      form,
      onSubmit: (values) => {
        updateRole2.mutate(values);
      },
      title: /* @__PURE__ */ jsx(Trans, { message: "Edit “:name“ role", values: { name: role.name } }),
      isLoading: updateRole2.isPending,
      children: /* @__PURE__ */ jsxs(Tabs, { isLazy: true, children: [
        /* @__PURE__ */ jsxs(TabList, { children: [
          /* @__PURE__ */ jsx(Tab, { children: /* @__PURE__ */ jsx(Trans, { message: "Settings" }) }),
          /* @__PURE__ */ jsx(Tab, { children: /* @__PURE__ */ jsx(Trans, { message: "Users" }) })
        ] }),
        /* @__PURE__ */ jsxs(TabPanels, { className: "pt-20", children: [
          /* @__PURE__ */ jsx(TabPanel, { children: /* @__PURE__ */ jsx(CrupdateRolePageSettingsPanel, { isInternal: role.internal }) }),
          /* @__PURE__ */ jsx(TabPanel, { children: /* @__PURE__ */ jsx(EditRolePageUsersPanel, { role }) })
        ] })
      ] })
    }
  );
}
const Endpoint$2 = "roles";
function useCreateRole(form) {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: (payload) => createRole(payload),
    onSuccess: () => {
      toast(trans(message("Created new role")));
      queryClient.invalidateQueries({ queryKey: DatatableDataQueryKey("roles") });
    },
    onError: (r) => onFormQueryError(r, form)
  });
}
function createRole({ id, ...payload }) {
  return apiClient.post(Endpoint$2, payload).then((r) => r.data);
}
function CreateRolePage() {
  const form = useForm({ defaultValues: { type: "sitewide" } });
  const createRole2 = useCreateRole(form);
  const navigate = useNavigate$1();
  return /* @__PURE__ */ jsx(
    CrupdateResourceLayout,
    {
      form,
      onSubmit: (values) => {
        createRole2.mutate(values, {
          onSuccess: (response) => {
            navigate(`/admin/roles/${response.role.id}/edit`);
          }
        });
      },
      title: /* @__PURE__ */ jsx(Trans, { message: "Add new role" }),
      isLoading: createRole2.isPending,
      children: /* @__PURE__ */ jsx(CrupdateRolePageSettingsPanel, {})
    }
  );
}
const TagIndexPageFilters = (types) => {
  return [
    {
      key: "type",
      label: message("Type"),
      description: message("Type of the tag"),
      defaultOperator: FilterOperator.ne,
      control: {
        type: FilterControlType.Select,
        defaultValue: types[0].name,
        options: types.map((type) => ({
          key: type.name,
          label: message(type.name),
          value: type.name
        }))
      }
    },
    createdAtFilter({
      description: message("Date tag was created")
    }),
    updatedAtFilter({
      description: message("Date tag was last updated")
    })
  ];
};
const softwareEngineerSvg = "/assets/software-engineer-ba026106.svg";
function CrupdateTagForm({
  form,
  onSubmit,
  formId
}) {
  const {
    tags: { types }
  } = useContext(SiteConfigContext);
  const watchedType = form.watch("type");
  const isSystem = !!types.find((t) => t.name === watchedType && t.system);
  return /* @__PURE__ */ jsxs(Form$1, { id: formId, form, onSubmit, children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        name: "name",
        label: /* @__PURE__ */ jsx(Trans, { message: "Name" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Unique tag identifier." }),
        className: "mb-20",
        required: true,
        autoFocus: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        name: "display_name",
        label: /* @__PURE__ */ jsx(Trans, { message: "Display name" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "User friendly tag name." }),
        className: "mb-20"
      }
    ),
    /* @__PURE__ */ jsx(
      FormSelect,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Type" }),
        name: "type",
        selectionMode: "single",
        disabled: isSystem,
        children: types.filter((t) => !t.system).map((type) => /* @__PURE__ */ jsx(Item, { value: type.name, children: /* @__PURE__ */ jsx(Trans, { message: type.name }) }, type.name))
      }
    )
  ] });
}
function slugifyString(text, replacement = "-", strict = false) {
  if (!text)
    return text;
  let slugified = slugify(text, {
    lower: true,
    replacement,
    strict,
    remove: /[*+~.()'"!:@?\|/\\#]/g
  });
  if (!slugified) {
    slugified = text.replace(/\s+/g, "-").toLowerCase();
  }
  return slugified;
}
function useCreateNewTag(form) {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: (props) => createNewTag(props),
    onSuccess: () => {
      toast(trans(message("Tag created")));
      queryClient.invalidateQueries({ queryKey: DatatableDataQueryKey("tags") });
    },
    onError: (err) => onFormQueryError(err, form)
  });
}
function createNewTag(payload) {
  payload.name = slugifyString(payload.name);
  return apiClient.post("tags", payload).then((r) => r.data);
}
function CreateTagDialog() {
  const { close, formId } = useDialogContext();
  const {
    tags: { types }
  } = useContext(SiteConfigContext);
  const form = useForm({
    defaultValues: {
      type: types[0].name
    }
  });
  const createNewTag2 = useCreateNewTag(form);
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Add new tag" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      CrupdateTagForm,
      {
        formId,
        form,
        onSubmit: (values) => {
          createNewTag2.mutate(values, {
            onSuccess: () => {
              close();
            }
          });
        }
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            close();
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          form: formId,
          disabled: createNewTag2.isPending,
          variant: "flat",
          color: "primary",
          type: "submit",
          children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
        }
      )
    ] })
  ] });
}
function useUpdateTag(form) {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: (props) => updateTag(props),
    onSuccess: () => {
      toast(trans(message("Tag updated")));
      queryClient.invalidateQueries({ queryKey: DatatableDataQueryKey("tags") });
    },
    onError: (err) => onFormQueryError(err, form)
  });
}
function updateTag({ id, ...payload }) {
  if (payload.name) {
    payload.name = slugifyString(payload.name);
  }
  return apiClient.put(`tags/${id}`, payload).then((r) => r.data);
}
function UpdateTagDialog({ tag }) {
  const { close, formId } = useDialogContext();
  const form = useForm({
    defaultValues: {
      id: tag.id,
      name: tag.name,
      display_name: tag.display_name,
      type: tag.type
    }
  });
  const updateTag2 = useUpdateTag(form);
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Update “:name“ tag", values: { name: tag.name } }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      CrupdateTagForm,
      {
        formId,
        form,
        onSubmit: (values) => {
          updateTag2.mutate(values, {
            onSuccess: () => {
              close();
            }
          });
        }
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            close();
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          form: formId,
          disabled: updateTag2.isPending,
          variant: "flat",
          color: "primary",
          type: "submit",
          children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
        }
      )
    ] })
  ] });
}
const columnConfig$3 = [
  {
    key: "name",
    allowsSorting: true,
    visibleInMode: "all",
    width: "flex-3 min-w-200",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Name" }),
    body: (tag) => tag.name
  },
  {
    key: "type",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Type" }),
    body: (tag) => tag.type
  },
  {
    key: "display_name",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Display name" }),
    body: (tag) => tag.display_name
  },
  {
    key: "updated_at",
    allowsSorting: true,
    width: "w-100",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Last updated" }),
    body: (tag) => /* @__PURE__ */ jsx(FormattedDate, { date: tag.updated_at })
  },
  {
    key: "actions",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    hideHeader: true,
    align: "end",
    width: "w-42 flex-shrink-0",
    visibleInMode: "all",
    body: (tag) => {
      return /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
        /* @__PURE__ */ jsx(IconButton, { size: "md", className: "text-muted", children: /* @__PURE__ */ jsx(EditIcon, {}) }),
        /* @__PURE__ */ jsx(UpdateTagDialog, { tag })
      ] });
    }
  }
];
function TagIndexPage() {
  const { tags } = useContext(SiteConfigContext);
  const filters = useMemo(() => {
    return TagIndexPageFilters(tags.types);
  }, [tags.types]);
  return /* @__PURE__ */ jsx(
    DataTablePage,
    {
      endpoint: "tags",
      title: /* @__PURE__ */ jsx(Trans, { message: "Tags" }),
      columns: columnConfig$3,
      filters,
      actions: /* @__PURE__ */ jsx(Actions$4, {}),
      selectedActions: /* @__PURE__ */ jsx(DeleteSelectedItemsAction, {}),
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: softwareEngineerSvg,
          title: /* @__PURE__ */ jsx(Trans, { message: "No tags have been created yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching tags" })
        }
      )
    }
  );
}
function Actions$4() {
  return /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
    /* @__PURE__ */ jsx(DataTableAddItemButton, { children: /* @__PURE__ */ jsx(Trans, { message: "Add new tag" }) }),
    /* @__PURE__ */ jsx(CreateTagDialog, {})
  ] }) });
}
const FormattedBytes = memo(({ bytes }) => {
  return /* @__PURE__ */ jsx(Fragment, { children: prettyBytes(bytes) });
});
const VisibilityIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" }),
  "VisibilityOutlined"
);
const uploadSvg = "/assets/upload-cabfc914.svg";
const columnConfig$2 = [
  {
    key: "name",
    allowsSorting: true,
    visibleInMode: "all",
    width: "flex-3 min-w-200",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Name" }),
    body: (entry) => /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-x-hidden overflow-ellipsis", children: entry.name }),
      /* @__PURE__ */ jsx("div", { className: "text-muted text-xs overflow-x-hidden overflow-ellipsis", children: entry.file_name })
    ] })
  },
  {
    key: "owner_id",
    allowsSorting: true,
    width: "flex-3 min-w-200",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Uploader" }),
    body: (entry) => {
      var _a2;
      const user = (_a2 = entry.users) == null ? void 0 : _a2[0];
      if (!user)
        return null;
      return /* @__PURE__ */ jsx(
        NameWithAvatar,
        {
          image: user.avatar,
          label: user.display_name,
          description: user.email
        }
      );
    }
  },
  {
    key: "type",
    width: "w-100 flex-shrink-0",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Type" }),
    body: (entry) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-12", children: [
      /* @__PURE__ */ jsx(FileTypeIcon, { type: entry.type, className: "w-24 h-24 overflow-hidden" }),
      /* @__PURE__ */ jsx("div", { className: "capitalize", children: entry.type })
    ] })
  },
  {
    key: "public",
    allowsSorting: true,
    width: "w-60 flex-shrink-0",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Public" }),
    body: (entry) => entry.public ? /* @__PURE__ */ jsx(CheckIcon, { className: "icon-md text-positive" }) : /* @__PURE__ */ jsx(CloseIcon, { className: "icon-md text-danger" })
  },
  {
    key: "file_size",
    allowsSorting: true,
    maxWidth: "max-w-100",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "File size" }),
    body: (entry) => /* @__PURE__ */ jsx(FormattedBytes, { bytes: entry.file_size })
  },
  {
    key: "updated_at",
    allowsSorting: true,
    width: "w-100",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Last updated" }),
    body: (entry) => /* @__PURE__ */ jsx(FormattedDate, { date: entry.updated_at })
  },
  {
    key: "actions",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    hideHeader: true,
    align: "end",
    width: "w-42 flex-shrink-0",
    visibleInMode: "all",
    body: (entry) => {
      return /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
        /* @__PURE__ */ jsx(IconButton, { size: "md", className: "text-muted", children: /* @__PURE__ */ jsx(VisibilityIcon, {}) }),
        /* @__PURE__ */ jsx(FilePreviewDialog, { entries: [entry] })
      ] });
    }
  }
];
function FileEntryIndexPage() {
  return /* @__PURE__ */ jsx(
    DataTablePage,
    {
      endpoint: "file-entries",
      title: /* @__PURE__ */ jsx(Trans, { message: "Uploaded files and folders" }),
      columns: columnConfig$2,
      filters: FILE_ENTRY_INDEX_FILTERS,
      selectedActions: /* @__PURE__ */ jsx(DeleteSelectedItemsAction, {}),
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: uploadSvg,
          title: /* @__PURE__ */ jsx(Trans, { message: "Nothing has been uploaded yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching files or folders" })
        }
      )
    }
  );
}
const SubscriptionIndexPageFilters = [
  {
    key: "ends_at",
    label: message("Status"),
    description: message("Whether subscription is active or cancelled"),
    defaultOperator: FilterOperator.eq,
    control: {
      type: FilterControlType.Select,
      defaultValue: "active",
      options: [
        {
          key: "active",
          label: message("Active"),
          value: { value: null, operator: FilterOperator.eq }
        },
        {
          key: "cancelled",
          label: message("Cancelled"),
          value: { value: null, operator: FilterOperator.ne }
        }
      ]
    }
  },
  {
    control: {
      type: FilterControlType.Select,
      defaultValue: "stripe",
      options: [
        {
          key: "stripe",
          label: message("Stripe"),
          value: "stripe"
        },
        {
          key: "paypal",
          label: message("PayPal"),
          value: "paypal"
        },
        {
          key: "none",
          label: message("None"),
          value: "none"
        }
      ]
    },
    key: "gateway_name",
    label: message("Gateway"),
    description: message(
      "With which payment provider was subscription created"
    ),
    defaultOperator: FilterOperator.eq
  },
  timestampFilter({
    key: "renews_at",
    label: message("Renew date"),
    description: message("Date subscription will renew")
  }),
  createdAtFilter({
    description: message("Date subscription was created")
  }),
  updatedAtFilter({
    description: message("Date subscription was last updated")
  })
];
const subscriptionsSvg = "/assets/subscriptions-7eacea42.svg";
function useUpdateSubscription(form) {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: (props) => updateSubscription(props),
    onSuccess: () => {
      toast(trans(message("Subscription updated")));
      queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey("billing/subscriptions")
      });
    },
    onError: (err) => onFormQueryError(err, form)
  });
}
function updateSubscription({
  id,
  ...payload
}) {
  return apiClient.put(`billing/subscriptions/${id}`, payload).then((r) => r.data);
}
function CrupdateSubscriptionForm({
  form,
  onSubmit,
  formId
}) {
  var _a2, _b;
  const query = useProducts();
  const watchedProductId = form.watch("product_id");
  const selectedProduct = (_a2 = query.data) == null ? void 0 : _a2.products.find(
    (p) => p.id === watchedProductId
  );
  return /* @__PURE__ */ jsxs(Form$1, { id: formId, form, onSubmit, children: [
    /* @__PURE__ */ jsx(
      FormNormalizedModelField,
      {
        name: "user_id",
        className: "mb-20",
        endpoint: "normalized-models/user",
        label: /* @__PURE__ */ jsx(Trans, { message: "User" })
      }
    ),
    /* @__PURE__ */ jsx(
      FormSelect,
      {
        name: "product_id",
        selectionMode: "single",
        className: "mb-20",
        label: /* @__PURE__ */ jsx(Trans, { message: "Plan" }),
        children: (_b = query.data) == null ? void 0 : _b.products.filter((p) => !p.free).map((product) => /* @__PURE__ */ jsx(Item, { value: product.id, children: /* @__PURE__ */ jsx(Trans, { message: product.name }) }, product.id))
      }
    ),
    !(selectedProduct == null ? void 0 : selectedProduct.free) && /* @__PURE__ */ jsx(
      FormSelect,
      {
        name: "price_id",
        selectionMode: "single",
        className: "mb-20",
        label: /* @__PURE__ */ jsx(Trans, { message: "Price" }),
        children: selectedProduct == null ? void 0 : selectedProduct.prices.map((price) => /* @__PURE__ */ jsx(Item, { value: price.id, children: /* @__PURE__ */ jsx(FormattedPrice, { price }) }, price.id))
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        inputElementType: "textarea",
        rows: 3,
        name: "description",
        label: /* @__PURE__ */ jsx(Trans, { message: "Description" }),
        className: "mb-20"
      }
    ),
    /* @__PURE__ */ jsx(
      FormDatePicker,
      {
        className: "mb-20",
        name: "renews_at",
        granularity: "day",
        label: /* @__PURE__ */ jsx(Trans, { message: "Renews at" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "This will only change local records. User will continue to be billed on their original cycle on the payment gateway." })
      }
    ),
    /* @__PURE__ */ jsx(
      FormDatePicker,
      {
        className: "mb-20",
        name: "ends_at",
        granularity: "day",
        label: /* @__PURE__ */ jsx(Trans, { message: "Ends at" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "This will only change local records. User will continue to be billed on their original cycle on the payment gateway." })
      }
    )
  ] });
}
function UpdateSubscriptionDialog({
  subscription
}) {
  const { close, formId } = useDialogContext();
  const form = useForm({
    defaultValues: {
      id: subscription.id,
      product_id: subscription.product_id,
      price_id: subscription.price_id,
      description: subscription.description,
      renews_at: subscription.renews_at,
      ends_at: subscription.ends_at,
      user_id: subscription.user_id
    }
  });
  const updateSubscription2 = useUpdateSubscription(form);
  return /* @__PURE__ */ jsxs(Dialog, { size: "md", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Update subscription" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      CrupdateSubscriptionForm,
      {
        formId,
        form,
        onSubmit: (values) => {
          updateSubscription2.mutate(values, {
            onSuccess: () => {
              close();
            }
          });
        }
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            close();
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          form: formId,
          disabled: updateSubscription2.isPending,
          variant: "flat",
          color: "primary",
          type: "submit",
          children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
        }
      )
    ] })
  ] });
}
const endpoint$3 = "billing/subscriptions";
function useCreateSubscription(form) {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: (props) => createNewSubscription(props),
    onSuccess: () => {
      toast(trans(message("Subscription created")));
      queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey(endpoint$3)
      });
    },
    onError: (err) => onFormQueryError(err, form)
  });
}
function createNewSubscription(payload) {
  return apiClient.post(endpoint$3, payload).then((r) => r.data);
}
function CreateSubscriptionDialog() {
  const { close, formId } = useDialogContext();
  const form = useForm({});
  const createSubscription = useCreateSubscription(form);
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Add new subscription" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      CrupdateSubscriptionForm,
      {
        formId,
        form,
        onSubmit: (values) => {
          createSubscription.mutate(values, {
            onSuccess: () => {
              close();
            }
          });
        }
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            close();
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" })
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          form: formId,
          disabled: createSubscription.isPending,
          variant: "flat",
          color: "primary",
          type: "submit",
          children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
        }
      )
    ] })
  ] });
}
const PauseIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" }),
  "PauseOutlined"
);
const PlayArrowIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M10 8.64 15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z" }),
  "PlayArrowOutlined"
);
const endpoint$2 = "billing/subscriptions";
const columnConfig$1 = [
  {
    key: "user_id",
    allowsSorting: true,
    width: "flex-3 min-w-200",
    visibleInMode: "all",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Customer" }),
    body: (subscription) => subscription.user && /* @__PURE__ */ jsx(
      NameWithAvatar,
      {
        image: subscription.user.avatar,
        label: subscription.user.display_name,
        description: subscription.user.email
      }
    )
  },
  {
    key: "status",
    width: "w-100 flex-shrink-0",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Status" }),
    body: (subscription) => /* @__PURE__ */ jsx(
      Chip,
      {
        size: "xs",
        color: subscription.valid ? "positive" : void 0,
        radius: "rounded",
        className: "w-max",
        children: subscription.gateway_status
      }
    )
  },
  {
    key: "product_id",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Plan" }),
    body: (subscription) => {
      var _a2;
      return (_a2 = subscription.product) == null ? void 0 : _a2.name;
    }
  },
  {
    key: "gateway_name",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Gateway" }),
    body: (subscription) => /* @__PURE__ */ jsx("span", { className: "capitalize", children: subscription.gateway_name })
  },
  {
    key: "renews_at",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Renews at" }),
    body: (subscription) => /* @__PURE__ */ jsx(FormattedDate, { date: subscription.renews_at })
  },
  {
    key: "ends_at",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Ends at" }),
    body: (subscription) => /* @__PURE__ */ jsx(FormattedDate, { date: subscription.ends_at })
  },
  {
    key: "created_at",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Created at" }),
    body: (subscription) => /* @__PURE__ */ jsx(FormattedDate, { date: subscription.created_at })
  },
  {
    key: "actions",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    hideHeader: true,
    align: "end",
    visibleInMode: "all",
    width: "w-128 flex-shrink-0",
    body: (subscription) => {
      return /* @__PURE__ */ jsx(SubscriptionActions, { subscription });
    }
  }
];
function SubscriptionsIndexPage() {
  return /* @__PURE__ */ jsx(
    DataTablePage,
    {
      endpoint: endpoint$2,
      title: /* @__PURE__ */ jsx(Trans, { message: "Subscriptions" }),
      columns: columnConfig$1,
      filters: SubscriptionIndexPageFilters,
      actions: /* @__PURE__ */ jsx(PageActions, {}),
      enableSelection: false,
      selectedActions: /* @__PURE__ */ jsx(DeleteSelectedItemsAction, {}),
      queryParams: { with: "product" },
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: subscriptionsSvg,
          title: /* @__PURE__ */ jsx(Trans, { message: "No subscriptions have been created yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching subscriptions" })
        }
      )
    }
  );
}
function PageActions() {
  return /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
    /* @__PURE__ */ jsx(DataTableAddItemButton, { children: /* @__PURE__ */ jsx(Trans, { message: "Add new subscription" }) }),
    /* @__PURE__ */ jsx(CreateSubscriptionDialog, {})
  ] }) });
}
function SubscriptionActions({ subscription }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
      /* @__PURE__ */ jsx(IconButton, { size: "md", className: "text-muted", children: /* @__PURE__ */ jsx(EditIcon, {}) }),
      /* @__PURE__ */ jsx(UpdateSubscriptionDialog, { subscription })
    ] }),
    subscription.cancelled && subscription.on_grace_period ? /* @__PURE__ */ jsx(ResumeSubscriptionButton, { subscription }) : null,
    subscription.active ? /* @__PURE__ */ jsx(SuspendSubscriptionButton, { subscription }) : null,
    /* @__PURE__ */ jsx(CancelSubscriptionButton, { subscription })
  ] });
}
function SuspendSubscriptionButton({ subscription }) {
  const cancelSubscription = useCancelSubscription();
  const handleSuspendSubscription = () => {
    cancelSubscription.mutate(
      { subscriptionId: subscription.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: DatatableDataQueryKey(endpoint$2)
          });
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (confirmed) => {
        if (confirmed) {
          handleSuspendSubscription();
        }
      },
      children: [
        /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Cancel subscription" }), children: /* @__PURE__ */ jsx(
          IconButton,
          {
            size: "md",
            className: "text-muted",
            disabled: cancelSubscription.isPending,
            children: /* @__PURE__ */ jsx(PauseIcon, {})
          }
        ) }),
        /* @__PURE__ */ jsx(
          ConfirmationDialog,
          {
            title: /* @__PURE__ */ jsx(Trans, { message: "Cancel subscription" }),
            body: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Trans, { message: "Are you sure you want to cancel this subscription?" }),
              /* @__PURE__ */ jsx("div", { className: "mt-10 text-sm font-semibold", children: /* @__PURE__ */ jsx(Trans, { message: "This will put user on grace period until their next scheduled renewal date. Subscription can be renewed until that date by user or from admin area." }) })
            ] }),
            confirm: /* @__PURE__ */ jsx(Trans, { message: "Confirm" })
          }
        )
      ]
    }
  );
}
function ResumeSubscriptionButton({ subscription }) {
  const resumeSubscription = useResumeSubscription();
  const handleResumeSubscription = () => {
    resumeSubscription.mutate(
      { subscriptionId: subscription.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: DatatableDataQueryKey(endpoint$2)
          });
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (confirmed) => {
        if (confirmed) {
          handleResumeSubscription();
        }
      },
      children: [
        /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Renew subscription" }), children: /* @__PURE__ */ jsx(
          IconButton,
          {
            size: "md",
            className: "text-muted",
            onClick: handleResumeSubscription,
            disabled: resumeSubscription.isPending,
            children: /* @__PURE__ */ jsx(PlayArrowIcon, {})
          }
        ) }),
        /* @__PURE__ */ jsx(
          ConfirmationDialog,
          {
            title: /* @__PURE__ */ jsx(Trans, { message: "Resume subscription" }),
            body: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Trans, { message: "Are you sure you want to resume this subscription?" }),
              /* @__PURE__ */ jsx("div", { className: "mt-10 text-sm font-semibold", children: /* @__PURE__ */ jsx(Trans, { message: "This will put user on their original plan and billing cycle." }) })
            ] }),
            confirm: /* @__PURE__ */ jsx(Trans, { message: "Confirm" })
          }
        )
      ]
    }
  );
}
function CancelSubscriptionButton({ subscription }) {
  const cancelSubscription = useCancelSubscription();
  const handleDeleteSubscription = () => {
    cancelSubscription.mutate(
      { subscriptionId: subscription.id, delete: true },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: DatatableDataQueryKey(endpoint$2)
          });
        }
      }
    );
  };
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (confirmed) => {
        if (confirmed) {
          handleDeleteSubscription();
        }
      },
      children: [
        /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Delete subscription" }), children: /* @__PURE__ */ jsx(
          IconButton,
          {
            size: "md",
            className: "text-muted",
            disabled: cancelSubscription.isPending,
            children: /* @__PURE__ */ jsx(CloseIcon, {})
          }
        ) }),
        /* @__PURE__ */ jsx(
          ConfirmationDialog,
          {
            isDanger: true,
            title: /* @__PURE__ */ jsx(Trans, { message: "Delete subscription" }),
            body: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Trans, { message: "Are you sure you want to delete this subscription?" }),
              /* @__PURE__ */ jsx("div", { className: "mt-10 text-sm font-semibold", children: /* @__PURE__ */ jsx(Trans, { message: "This will permanently delete the subscription and immediately cancel it on billing gateway. Subscription will not be renewable anymore." }) })
            ] }),
            confirm: /* @__PURE__ */ jsx(Trans, { message: "Confirm" })
          }
        )
      ]
    }
  );
}
const SyncIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" }),
  "SyncOutlined"
);
function useSyncProducts() {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: () => syncPlans(),
    onSuccess: () => {
      toast(trans(message("Plans synced")));
    },
    onError: (err) => showHttpErrorToast(err, message("Could not sync plans"))
  });
}
function syncPlans() {
  return apiClient.post("billing/products/sync").then((r) => r.data);
}
const endpoint$1 = (id) => `billing/products/${id}`;
function useDeleteProduct() {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: (payload) => updateProduct$1(payload),
    onSuccess: () => {
      toast(trans(message("Plan deleted")));
      queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey("billing/products")
      });
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function updateProduct$1({ productId }) {
  return apiClient.delete(endpoint$1(productId)).then((r) => r.data);
}
const PlansIndexPageFilters = [
  {
    key: "subscriptions",
    label: message("Subscriptions"),
    description: message("Whether plan has any active subscriptions"),
    defaultOperator: FilterOperator.eq,
    control: {
      type: FilterControlType.Select,
      defaultValue: "01",
      options: [
        {
          key: "01",
          label: message("Has active subscriptions"),
          value: { value: "*", operator: FilterOperator.has }
        },
        {
          key: "02",
          label: message("Does not have active subscriptions"),
          value: { value: "*", operator: FilterOperator.doesntHave }
        }
      ]
    }
  },
  createdAtFilter({
    description: message("Date plan was created")
  }),
  updatedAtFilter({
    description: message("Date plan was last updated")
  })
];
const columnConfig = [
  {
    key: "name",
    allowsSorting: true,
    visibleInMode: "all",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Name" }),
    body: (product) => {
      const price = product.prices[0];
      return /* @__PURE__ */ jsx(
        NameWithAvatar,
        {
          label: product.name,
          description: product.free ? /* @__PURE__ */ jsx(Trans, { message: "Free" }) : /* @__PURE__ */ jsx(FormattedPrice, { price })
        }
      );
    }
  },
  {
    key: "created_at",
    allowsSorting: true,
    maxWidth: "max-w-100",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Created" }),
    body: (product) => /* @__PURE__ */ jsx(FormattedDate, { date: product.created_at })
  },
  {
    key: "updated_at",
    allowsSorting: true,
    maxWidth: "max-w-100",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Last updated" }),
    body: (product) => /* @__PURE__ */ jsx(FormattedDate, { date: product.updated_at })
  },
  {
    key: "actions",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    visibleInMode: "all",
    hideHeader: true,
    align: "end",
    maxWidth: "max-w-84",
    body: (product) => {
      return /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          IconButton,
          {
            size: "md",
            className: "text-muted",
            elementType: Link,
            to: `/admin/plans/${product.id}/edit`,
            children: /* @__PURE__ */ jsx(EditIcon, {})
          }
        ),
        /* @__PURE__ */ jsx(DeleteProductButton, { product })
      ] });
    }
  }
];
function PlansIndexPage() {
  const navigate = useNavigate$1();
  return /* @__PURE__ */ jsx(
    DataTablePage,
    {
      endpoint: "billing/products",
      title: /* @__PURE__ */ jsx(Trans, { message: "Subscription plans" }),
      columns: columnConfig,
      actions: /* @__PURE__ */ jsx(Actions$3, {}),
      enableSelection: false,
      filters: PlansIndexPageFilters,
      onRowAction: (item) => {
        navigate(`/admin/plans/${item.id}/edit`);
      },
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: softwareEngineerSvg,
          title: /* @__PURE__ */ jsx(Trans, { message: "No plans have been created yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching plans" })
        }
      )
    }
  );
}
function DeleteProductButton({ product }) {
  const deleteProduct = useDeleteProduct();
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (confirmed) => {
        if (confirmed) {
          deleteProduct.mutate({ productId: product.id });
        }
      },
      children: [
        /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Delete plan" }), children: /* @__PURE__ */ jsx(
          IconButton,
          {
            size: "md",
            className: "text-muted",
            disabled: deleteProduct.isPending,
            children: /* @__PURE__ */ jsx(DeleteIcon, {})
          }
        ) }),
        /* @__PURE__ */ jsx(
          ConfirmationDialog,
          {
            title: /* @__PURE__ */ jsx(Trans, { message: "Delete plan" }),
            body: /* @__PURE__ */ jsx(Trans, { message: "Are you sure you want to delete this plan?" }),
            confirm: /* @__PURE__ */ jsx(Trans, { message: "Delete" })
          }
        )
      ]
    }
  );
}
function Actions$3() {
  const syncPlans2 = useSyncProducts();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Sync plans with Stripe & PayPal" }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        color: "primary",
        variant: "outline",
        size: "sm",
        disabled: syncPlans2.isPending,
        onClick: () => {
          syncPlans2.mutate();
        },
        children: /* @__PURE__ */ jsx(SyncIcon, {})
      }
    ) }),
    /* @__PURE__ */ jsx(DataTableAddItemButton, { elementType: Link, to: "/admin/plans/new", children: /* @__PURE__ */ jsx(Trans, { message: "Add new plan" }) })
  ] });
}
const Endpoint$1 = (id) => `billing/products/${id}`;
function useProduct() {
  const { productId } = useParams();
  return useQuery({
    queryKey: [Endpoint$1(productId)],
    queryFn: () => fetchProduct(productId)
  });
}
function fetchProduct(productId) {
  return apiClient.get(Endpoint$1(productId)).then((response) => response.data);
}
const BillingPeriodPresets = [
  {
    key: "day1",
    label: message("Daily"),
    interval: "day",
    interval_count: 1
  },
  {
    key: "week1",
    label: message("Weekly"),
    interval: "week",
    interval_count: 1
  },
  {
    key: "month1",
    label: message("Monthly"),
    interval: "month",
    interval_count: 1
  },
  {
    key: "month3",
    label: message("Every 3 months"),
    interval: "month",
    interval_count: 3
  },
  {
    key: "month6",
    label: message("Every 6 months"),
    interval: "month",
    interval_count: 6
  },
  {
    key: "year1",
    label: message("Yearly"),
    interval: "year",
    interval_count: 1
  },
  {
    key: "custom",
    label: message("Custom"),
    interval: null,
    interval_count: null
  }
];
function PriceForm({ index, onRemovePrice }) {
  const { trans } = useTrans();
  const query = useValueLists(["currencies"]);
  const currencies = useMemo(() => {
    var _a2;
    return ((_a2 = query.data) == null ? void 0 : _a2.currencies) ? Object.values(query.data.currencies) : [];
  }, [query.data]);
  const { watch, getValues } = useFormContext();
  const isNewProduct = !watch("id");
  const isNewPrice = watch(`prices.${index}.id`) == null;
  const subscriberCount = watch(`prices.${index}.subscriptions_count`) || 0;
  const [billingPeriodPreset, setBillingPeriodPreset] = useState(() => {
    const interval = getValues(`prices.${index}.interval`);
    const intervalCount = getValues(`prices.${index}.interval_count`);
    const preset = BillingPeriodPresets.find(
      (p) => p.key === `${interval}${intervalCount}`
    );
    return preset ? preset.key : "custom";
  });
  const allowPriceChanges = isNewProduct || isNewPrice || !subscriberCount;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !allowPriceChanges && /* @__PURE__ */ jsx("p", { className: "text-muted text-sm max-w-500 mb-20", children: /* @__PURE__ */ jsx(
      Trans,
      {
        message: "This price can't modified or deleted, because it has [one 1 subscriber|other :count subscribers]. You can instead add a new price.",
        values: { count: subscriberCount }
      }
    ) }),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        required: true,
        disabled: !allowPriceChanges,
        label: /* @__PURE__ */ jsx(Trans, { message: "Amount" }),
        type: "number",
        min: 0.1,
        step: 0.01,
        name: `prices.${index}.amount`,
        className: "mb-20"
      }
    ),
    /* @__PURE__ */ jsx(
      FormSelect,
      {
        required: true,
        disabled: !allowPriceChanges,
        label: /* @__PURE__ */ jsx(Trans, { message: "Currency" }),
        name: `prices.${index}.currency`,
        items: currencies,
        showSearchField: true,
        searchPlaceholder: trans(message("Search currencies")),
        selectionMode: "single",
        className: "mb-20",
        children: (item) => /* @__PURE__ */ jsx(
          Item,
          {
            value: item.code,
            children: `${item.code}: ${item.name}`
          },
          item.code
        )
      }
    ),
    /* @__PURE__ */ jsx(
      BillingPeriodSelect,
      {
        disabled: !allowPriceChanges,
        index,
        value: billingPeriodPreset,
        onValueChange: setBillingPeriodPreset
      }
    ),
    billingPeriodPreset === "custom" && /* @__PURE__ */ jsx(CustomBillingPeriodField, { disabled: !allowPriceChanges, index }),
    /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx(
      Button,
      {
        size: "xs",
        variant: "outline",
        color: "danger",
        disabled: !allowPriceChanges,
        onClick: () => {
          onRemovePrice();
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Delete price" })
      }
    ) })
  ] });
}
function BillingPeriodSelect({
  index,
  value,
  onValueChange,
  disabled
}) {
  const { setValue: setFormValue } = useFormContext();
  return /* @__PURE__ */ jsx(
    SelectForwardRef,
    {
      label: /* @__PURE__ */ jsx(Trans, { message: "Billing period" }),
      disabled,
      className: "mb-20",
      selectionMode: "single",
      selectedValue: value,
      onSelectionChange: (value2) => {
        onValueChange(value2);
        if (value2 === "custom")
          ;
        else {
          const preset = BillingPeriodPresets.find((p) => p.key === value2);
          if (preset) {
            setFormValue(
              `prices.${index}.interval`,
              preset.interval
            );
            setFormValue(
              `prices.${index}.interval_count`,
              preset.interval_count
            );
          }
        }
      },
      children: BillingPeriodPresets.map((preset) => /* @__PURE__ */ jsx(Item, { value: preset.key, children: /* @__PURE__ */ jsx(Trans, { ...preset.label }) }, preset.key))
    }
  );
}
function CustomBillingPeriodField({
  index,
  disabled
}) {
  const { watch } = useFormContext();
  const interval = watch(`prices.${index}.interval`);
  let maxIntervalCount;
  if (interval === "day") {
    maxIntervalCount = 365;
  } else if (interval === "week") {
    maxIntervalCount = 52;
  } else {
    maxIntervalCount = 12;
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex border rounded w-min", children: [
    /* @__PURE__ */ jsx("div", { className: "px-18 flex items-center text-sm", children: /* @__PURE__ */ jsx(Trans, { message: "Every" }) }),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        inputShadow: "shadow-none",
        inputBorder: "border-none",
        className: "border-l border-r w-80",
        name: `prices.${index}.interval_count`,
        type: "number",
        min: 1,
        max: maxIntervalCount,
        disabled,
        required: true
      }
    ),
    /* @__PURE__ */ jsxs(
      FormSelect,
      {
        inputShadow: "shadow-none",
        inputBorder: "border-none",
        name: `prices.${index}.interval`,
        selectionMode: "single",
        disabled,
        children: [
          /* @__PURE__ */ jsx(Item, { value: "day", children: /* @__PURE__ */ jsx(Trans, { message: "Days" }) }),
          /* @__PURE__ */ jsx(Item, { value: "week", children: /* @__PURE__ */ jsx(Trans, { message: "Weeks" }) }),
          /* @__PURE__ */ jsx(Item, { value: "month", children: /* @__PURE__ */ jsx(Trans, { message: "Months" }) })
        ]
      }
    )
  ] });
}
function CrupdatePlanForm() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        name: "name",
        label: /* @__PURE__ */ jsx(Trans, { message: "Name" }),
        className: "mb-20",
        required: true,
        autoFocus: true
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        name: "description",
        label: /* @__PURE__ */ jsx(Trans, { message: "Description" }),
        className: "mb-20",
        inputElementType: "textarea",
        rows: 4
      }
    ),
    /* @__PURE__ */ jsxs(
      FormSelect,
      {
        name: "position",
        selectionMode: "single",
        label: /* @__PURE__ */ jsx(Trans, { message: "Position in pricing table" }),
        className: "mb-20",
        children: [
          /* @__PURE__ */ jsx(Item, { value: 0, children: /* @__PURE__ */ jsx(Trans, { message: "First" }) }),
          /* @__PURE__ */ jsx(Item, { value: 1, children: /* @__PURE__ */ jsx(Trans, { message: "Second" }) }),
          /* @__PURE__ */ jsx(Item, { value: 2, children: /* @__PURE__ */ jsx(Trans, { message: "Third" }) }),
          /* @__PURE__ */ jsx(Item, { value: 3, children: /* @__PURE__ */ jsx(Trans, { message: "Fourth" }) }),
          /* @__PURE__ */ jsx(Item, { value: 4, children: /* @__PURE__ */ jsx(Trans, { message: "Fifth" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      FormFileSizeField,
      {
        className: "mb-30",
        name: "available_space",
        label: /* @__PURE__ */ jsx(Trans, { message: "Allowed storage space" }),
        description: /* @__PURE__ */ jsx(
          Trans,
          {
            values: {
              a: (parts) => /* @__PURE__ */ jsx(
                Link,
                {
                  className: LinkStyle,
                  target: "_blank",
                  to: "/admin/settings/uploading",
                  children: parts
                }
              )
            },
            message: "Total storage space all user uploads are allowed to take up."
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        name: "recommended",
        className: "mb-20",
        description: /* @__PURE__ */ jsx(Trans, { message: "Plan will be displayed more prominently on pricing page." }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Recommend" })
      }
    ),
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        name: "hidden",
        className: "mb-20",
        description: /* @__PURE__ */ jsx(Trans, { message: "Plan will not be shown on pricing or upgrade pages." }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Hidden" })
      }
    ),
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        name: "free",
        className: "mb-20",
        description: /* @__PURE__ */ jsx(Trans, { message: "Will be assigned to all users, if they are not subscribed already." }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Free" })
      }
    ),
    /* @__PURE__ */ jsx(Header, { children: /* @__PURE__ */ jsx(Trans, { message: "Feature list" }) }),
    /* @__PURE__ */ jsx(FeatureListForm, {}),
    /* @__PURE__ */ jsx(PricingListForm, {}),
    /* @__PURE__ */ jsx(Header, { children: /* @__PURE__ */ jsx(Trans, { message: "Permissions" }) }),
    /* @__PURE__ */ jsx(FormPermissionSelector, { name: "permissions" })
  ] });
}
function Header({ children }) {
  return /* @__PURE__ */ jsx("h2", { className: "mt-40 mb-20 text-base font-semibold", children });
}
function FeatureListForm() {
  const { fields, append, remove } = useFieldArray({
    name: "feature_list"
  });
  return /* @__PURE__ */ jsxs("div", { children: [
    fields.map((field, index) => {
      return /* @__PURE__ */ jsxs("div", { className: "flex gap-10 mb-10", children: [
        /* @__PURE__ */ jsx(
          FormTextField,
          {
            name: `feature_list.${index}.value`,
            size: "sm",
            className: "flex-auto"
          }
        ),
        /* @__PURE__ */ jsx(
          IconButton,
          {
            size: "sm",
            color: "primary",
            className: "flex-shrink-0",
            onClick: () => {
              remove(index);
            },
            children: /* @__PURE__ */ jsx(CloseIcon, {})
          }
        )
      ] }, field.id);
    }),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "text",
        color: "primary",
        startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
        size: "xs",
        onClick: () => {
          append({ value: "" });
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Add another line" })
      }
    )
  ] });
}
function PricingListForm() {
  var _a2;
  const {
    watch,
    formState: { errors }
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "prices",
    keyName: "key"
  });
  if (watch("free")) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Header, { children: /* @__PURE__ */ jsx(Trans, { message: "Pricing" }) }),
    ((_a2 = errors.prices) == null ? void 0 : _a2.message) && /* @__PURE__ */ jsx("div", { className: "text-sm text-danger mb-20", children: errors.prices.message }),
    /* @__PURE__ */ jsx(Accordion, { variant: "outline", className: "mb-10", children: fields.map((field, index) => /* @__PURE__ */ jsx(
      AccordionItem,
      {
        label: /* @__PURE__ */ jsx(FormattedPrice, { price: field }),
        children: /* @__PURE__ */ jsx(
          PriceForm,
          {
            index,
            onRemovePrice: () => {
              remove(index);
            }
          }
        )
      },
      field.key
    )) }),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "text",
        color: "primary",
        startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
        size: "xs",
        onClick: () => {
          append({
            currency: "USD",
            amount: 1,
            interval_count: 1,
            interval: "month"
          });
        },
        children: /* @__PURE__ */ jsx(Trans, { message: "Add another price" })
      }
    )
  ] });
}
const Endpoint = (id) => `billing/products/${id}`;
function useUpdateProduct(form) {
  const { trans } = useTrans();
  const navigate = useNavigate$1();
  return useMutation({
    mutationFn: (payload) => updateProduct(payload),
    onSuccess: (response) => {
      toast(trans(message("Plan updated")));
      queryClient.invalidateQueries({
        queryKey: [Endpoint(response.product.id)]
      });
      queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey("billing/products")
      });
      navigate("/admin/plans");
    },
    onError: (err) => onFormQueryError(err, form)
  });
}
function updateProduct({
  id,
  ...payload
}) {
  const backendPayload = {
    ...payload,
    feature_list: payload.feature_list.map((feature) => feature.value)
  };
  return apiClient.put(Endpoint(id), backendPayload).then((r) => r.data);
}
function EditPlanPage() {
  const query = useProduct();
  if (query.status !== "success") {
    return /* @__PURE__ */ jsx(FullPageLoader, {});
  }
  return /* @__PURE__ */ jsx(PageContent$1, { product: query.data.product });
}
function PageContent$1({ product }) {
  const form = useForm({
    defaultValues: {
      ...product,
      feature_list: product.feature_list.map((f) => ({ value: f }))
    }
  });
  const updateProduct2 = useUpdateProduct(form);
  return /* @__PURE__ */ jsx(
    CrupdateResourceLayout,
    {
      form,
      onSubmit: (values) => {
        updateProduct2.mutate(values);
      },
      title: /* @__PURE__ */ jsx(Trans, { message: "Edit “:name“ plan", values: { name: product.name } }),
      isLoading: updateProduct2.isPending,
      children: /* @__PURE__ */ jsx(CrupdatePlanForm, {})
    }
  );
}
const endpoint = "billing/products";
function useCreateProduct(form) {
  const { trans } = useTrans();
  const navigate = useNavigate$1();
  return useMutation({
    mutationFn: (payload) => createProduct(payload),
    onSuccess: () => {
      toast(trans(message("Plan created")));
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey("billing/products")
      });
      navigate("/admin/plans");
    },
    onError: (err) => onFormQueryError(err, form)
  });
}
function createProduct(payload) {
  const backendPayload = {
    ...payload,
    feature_list: payload.feature_list.map((feature) => feature.value)
  };
  return apiClient.post(endpoint, backendPayload).then((r) => r.data);
}
function CreatePlanPage() {
  const form = useForm({
    defaultValues: {
      free: false,
      recommended: false
    }
  });
  const createProduct2 = useCreateProduct(form);
  return /* @__PURE__ */ jsx(
    CrupdateResourceLayout,
    {
      form,
      onSubmit: (values) => {
        createProduct2.mutate(values);
      },
      title: /* @__PURE__ */ jsx(Trans, { message: "Create new plan" }),
      isLoading: createProduct2.isPending,
      children: /* @__PURE__ */ jsx(CrupdatePlanForm, {})
    }
  );
}
function GdprSettings() {
  return /* @__PURE__ */ jsxs(
    SettingsPanel,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "GDPR" }),
      description: /* @__PURE__ */ jsx(Trans, { message: "Configure settings related to EU General Data Protection Regulation." }),
      children: [
        /* @__PURE__ */ jsx(CookieNoticeSection, {}),
        /* @__PURE__ */ jsx(SettingsSeparator, {}),
        /* @__PURE__ */ jsx(RegistrationPoliciesSection, {})
      ]
    }
  );
}
function CookieNoticeSection() {
  const { watch } = useFormContext();
  const noticeEnabled = watch("client.cookie_notice.enable");
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      FormSwitch,
      {
        name: "client.cookie_notice.enable",
        className: "mb-20",
        description: /* @__PURE__ */ jsx(Trans, { message: "Whether cookie notice should be shown automatically to users from EU until it is accepted." }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Enable cookie notice" })
      }
    ),
    noticeEnabled && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-20 border-b pb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-20 border-b pb-10 text-sm font-medium", children: /* @__PURE__ */ jsx(Trans, { message: "Information button" }) }),
        /* @__PURE__ */ jsx(
          MenuItemForm,
          {
            hideRoleAndPermissionFields: true,
            formPathPrefix: "client.cookie_notice.button"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        FormSelect,
        {
          name: "client.cookie_notice.position",
          selectionMode: "single",
          label: /* @__PURE__ */ jsx(Trans, { message: "Cookie notice position" }),
          className: "mb-20",
          children: [
            /* @__PURE__ */ jsx(Item, { value: "top", children: /* @__PURE__ */ jsx(Trans, { message: "Top" }) }),
            /* @__PURE__ */ jsx(Item, { value: "bottom", children: /* @__PURE__ */ jsx(Trans, { message: "Bottom" }) })
          ]
        }
      )
    ] })
  ] });
}
function RegistrationPoliciesSection() {
  const { fields, append, remove } = useFieldArray({
    name: "client.registration.policies"
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 text-sm", children: /* @__PURE__ */ jsx(Trans, { message: "Registration policies" }) }),
    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted", children: /* @__PURE__ */ jsx(Trans, { message: "Create policies that will be shown on registration page. User will be required to accept them by toggling a checkbox." }) }),
    /* @__PURE__ */ jsx(Accordion, { className: "mt-16", variant: "outline", children: fields.map((field, index) => /* @__PURE__ */ jsx(
      AccordionItem,
      {
        label: field.label,
        chevronPosition: "left",
        endAppend: /* @__PURE__ */ jsx(
          IconButton,
          {
            variant: "text",
            color: "danger",
            size: "sm",
            onClick: () => {
              remove(index);
            },
            children: /* @__PURE__ */ jsx(CloseIcon, {})
          }
        ),
        children: /* @__PURE__ */ jsx(
          MenuItemForm,
          {
            hideRoleAndPermissionFields: true,
            formPathPrefix: `client.register_policies.${index}`
          }
        )
      },
      field.id
    )) }),
    /* @__PURE__ */ jsxs(
      DialogTrigger,
      {
        type: "modal",
        onClose: (value) => {
          if (value) {
            append(value);
          }
        },
        children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "mt-12",
              variant: "link",
              color: "primary",
              startIcon: /* @__PURE__ */ jsx(AddIcon, {}),
              size: "xs",
              children: /* @__PURE__ */ jsx(Trans, { message: "Add another policy" })
            }
          ),
          /* @__PURE__ */ jsx(AddMenuItemDialog, { title: /* @__PURE__ */ jsx(Trans, { message: "Add policy" }) })
        ]
      }
    )
  ] });
}
const AppAdminRoutes = [];
function useUpdateCustomPage(endpoint2) {
  const { pageId } = useParams();
  const finalEndpoint = `${endpoint2 || "custom-pages"}/${pageId}`;
  return useMutation({
    mutationFn: (payload) => updatePage(payload, finalEndpoint),
    onError: (err) => showHttpErrorToast(err),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["custom-pages"] });
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey(finalEndpoint)
      });
      toast(message("Page updated"));
    }
  });
}
function updatePage(payload, endpoint2) {
  return apiClient.put(`${endpoint2}`, payload).then((r) => r.data);
}
function ArticleEditorTitle() {
  const [editingTitle, setEditingTitle] = useState(false);
  const { trans } = useTrans();
  const form = useFormContext();
  const watchedTitle = form.watch("title");
  const titlePlaceholder = trans({ message: "Title" });
  if (editingTitle) {
    return /* @__PURE__ */ jsx(
      FormTextField,
      {
        placeholder: titlePlaceholder,
        autoFocus: true,
        className: "mb-30",
        onBlur: () => {
          setEditingTitle(false);
        },
        name: "title",
        required: true
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "h1",
    {
      tabIndex: 0,
      onClick: () => {
        setEditingTitle(true);
      },
      onFocus: () => {
        setEditingTitle(true);
      },
      className: clsx(
        "hover:bg-primary/focus rounded cursor-pointer",
        !watchedTitle && "text-muted"
      ),
      children: [
        watchedTitle || titlePlaceholder,
        /* @__PURE__ */ jsx(EditIcon, { className: "icon-sm mx-8 mt-8 align-top text-muted" })
      ]
    }
  );
}
function SlugEditor({
  host,
  value: initialValue = "",
  placeholder,
  onChange,
  className,
  inputRef,
  onInputBlur,
  showLinkIcon = true,
  pattern,
  minLength,
  maxLength,
  hideButton,
  ...props
}) {
  const { base_url } = useSettings();
  const prefix = props.prefix ? `/${props.prefix}` : "";
  const suffix = props.suffix ? `/${props.suffix}` : "";
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  host = host || base_url;
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const handleSubmit = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
      if (value) {
        onChange == null ? void 0 : onChange(value);
      }
    }
  };
  let preview = "";
  if (value) {
    preview = value;
  } else if (placeholder) {
    preview = slugifyString(placeholder);
  }
  return (
    // can't use <form/> here as component might be used inside another form
    /* @__PURE__ */ jsxs("div", { className: clsx("flex items-center", className), children: [
      showLinkIcon && /* @__PURE__ */ jsx(LinkIcon, { className: "icon-md text-muted" }),
      /* @__PURE__ */ jsxs("div", { className: "text-primary ml-6 mr-14", children: [
        host,
        prefix,
        !isEditing && preview && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { children: "/" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: preview })
        ] }),
        !isEditing ? suffix : null
      ] }),
      isEditing && /* @__PURE__ */ jsx(
        TextField,
        {
          pattern,
          minLength,
          maxLength,
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          },
          ref: inputRef,
          "aria-label": "slug",
          autoFocus: true,
          className: "mr-14",
          size: "2xs",
          value,
          onBlur: onInputBlur,
          onChange: (e) => {
            setValue(e.target.value);
          }
        }
      ),
      !hideButton && /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          color: "chip",
          variant: "outline",
          size: "2xs",
          onClick: () => {
            handleSubmit();
          },
          children: isEditing ? /* @__PURE__ */ jsx(Trans, { message: "Save" }) : /* @__PURE__ */ jsx(Trans, { message: "Edit" })
        }
      )
    ] })
  );
}
const UndoIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" }),
  "UndoOutlined"
);
const RedoIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z" }),
  "RedoOutlined"
);
function HistoryButtons({ editor }) {
  return /* @__PURE__ */ jsxs("span", { children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "md",
        disabled: !editor.can().undo(),
        onClick: () => {
          editor.commands.focus();
          editor.commands.undo();
        },
        children: /* @__PURE__ */ jsx(UndoIcon, {})
      }
    ),
    /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "md",
        disabled: !editor.can().redo(),
        onClick: () => {
          editor.commands.focus();
          editor.commands.redo();
        },
        children: /* @__PURE__ */ jsx(RedoIcon, {})
      }
    )
  ] });
}
const CodeIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" }),
  "CodeOutlined"
);
function ModeButton({ editor }) {
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      type: "modal",
      onClose: (newValue) => {
        if (newValue != null) {
          editor == null ? void 0 : editor.commands.setContent(newValue);
        }
      },
      children: [
        /* @__PURE__ */ jsx(Button, { variant: "text", startIcon: /* @__PURE__ */ jsx(CodeIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Source" }) }),
        /* @__PURE__ */ jsx(
          AceDialog,
          {
            title: /* @__PURE__ */ jsx(Trans, { message: "Source code" }),
            defaultValue: editor.getHTML()
          }
        )
      ]
    }
  );
}
function Divider() {
  return /* @__PURE__ */ jsx("div", { className: "self-stretch mx-4 w-1 bg-divider flex-shrink-0" });
}
const FormatBoldIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" }),
  "FormatBoldOutlined"
);
const FormatItalicIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4h-8z" }),
  "FormatItalicOutlined"
);
const FormatUnderlinedIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" }),
  "FormatUnderlinedOutlined"
);
function FontStyleButtons({ editor, size }) {
  return /* @__PURE__ */ jsxs("span", { className: clsx("flex-shrink-0 whitespace-nowrap"), children: [
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Bold" }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        size,
        color: editor.isActive("bold") ? "primary" : null,
        onClick: () => {
          editor.commands.focus();
          editor.commands.toggleBold();
        },
        children: /* @__PURE__ */ jsx(FormatBoldIcon, {})
      }
    ) }),
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Italic" }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        size,
        color: editor.isActive("italic") ? "primary" : null,
        onClick: () => {
          editor.commands.focus();
          editor.commands.toggleItalic();
        },
        children: /* @__PURE__ */ jsx(FormatItalicIcon, {})
      }
    ) }),
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Underline" }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        size,
        color: editor.isActive("underline") ? "primary" : null,
        onClick: () => {
          editor.commands.focus();
          editor.commands.toggleUnderline();
        },
        children: /* @__PURE__ */ jsx(FormatUnderlinedIcon, {})
      }
    ) })
  ] });
}
const FormatListBulletedIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" }),
  "FormatListBulletedOutlined"
);
const FormatListNumberedIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" }),
  "FormatListNumberedOutlined"
);
function ListButtons({ editor, size }) {
  const bulletActive = editor.isActive("bulletList");
  const orderedActive = editor.isActive("orderedList");
  return /* @__PURE__ */ jsxs("span", { className: clsx("flex-shrink-0", "whitespace-nowrap"), children: [
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Bulleted list" }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        size,
        color: bulletActive ? "primary" : null,
        onClick: () => {
          editor.commands.focus();
          editor.commands.toggleBulletList();
        },
        children: /* @__PURE__ */ jsx(FormatListBulletedIcon, {})
      }
    ) }),
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Numbered list" }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        size,
        color: orderedActive ? "primary" : null,
        onClick: () => {
          editor.commands.focus();
          editor.commands.toggleOrderedList();
        },
        children: /* @__PURE__ */ jsx(FormatListNumberedIcon, {})
      }
    ) })
  ] });
}
function insertLinkIntoTextEditor(editor, { text, target, href }) {
  if (editor.state.selection.empty && text) {
    editor.commands.insertContent(
      `<a href="${href}" target="${target}">${text}</a>`
    );
  } else if (!editor.state.selection.empty) {
    if (!href) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href, target }).run();
    }
  }
}
function LinkButton({ editor, size }) {
  return /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Insert link" }), children: /* @__PURE__ */ jsx(IconButton, { size, className: clsx("flex-shrink-0"), children: /* @__PURE__ */ jsx(LinkIcon, {}) }) }),
    /* @__PURE__ */ jsx(LinkDialog, { editor })
  ] });
}
function LinkDialog({ editor }) {
  const previousUrl = editor.getAttributes("link").href;
  const previousText = editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to,
    ""
  );
  const form = useForm({
    defaultValues: { href: previousUrl, text: previousText, target: "_blank" }
  });
  const { formId, close } = useDialogContext();
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Insert link" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsxs(
      Form$1,
      {
        form,
        id: formId,
        onSubmit: (value) => {
          insertLinkIntoTextEditor(editor, value);
          close();
        },
        children: [
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              name: "href",
              label: /* @__PURE__ */ jsx(Trans, { message: "URL" }),
              autoFocus: true,
              type: "url",
              className: "mb-20"
            }
          ),
          /* @__PURE__ */ jsx(
            FormTextField,
            {
              name: "text",
              label: /* @__PURE__ */ jsx(Trans, { message: "Text to display" }),
              className: "mb-20"
            }
          ),
          /* @__PURE__ */ jsxs(
            FormSelect,
            {
              selectionMode: "single",
              name: "target",
              label: /* @__PURE__ */ jsx(Trans, { message: "Open link in..." }),
              children: [
                /* @__PURE__ */ jsx(Item, { value: "_self", children: /* @__PURE__ */ jsx(Trans, { message: "Current window" }) }),
                /* @__PURE__ */ jsx(Item, { value: "_blank", children: /* @__PURE__ */ jsx(Trans, { message: "New window" }) })
              ]
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: close, variant: "text", children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(Button, { type: "submit", form: formId, variant: "flat", color: "primary", children: /* @__PURE__ */ jsx(Trans, { message: "Save" }) })
    ] })
  ] });
}
const ImageIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14z" }),
  "ImageOutlined"
);
const TwoMB = 2097152;
function ImageButton({ editor, size, diskPrefix = "page_media" }) {
  const { selectAndUploadFile } = useActiveUpload();
  const handleUpload = () => {
    selectAndUploadFile({
      showToastOnRestrictionFail: true,
      restrictions: {
        allowedFileTypes: [UploadInputType.image],
        maxFileSize: TwoMB
      },
      metadata: {
        diskPrefix,
        disk: Disk.public
      },
      onSuccess: (entry) => {
        editor.commands.focus();
        editor.commands.setImage({
          src: entry.url
        });
      }
    });
  };
  return /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Insert image" }), children: /* @__PURE__ */ jsx(
    IconButton,
    {
      size,
      onClick: handleUpload,
      className: clsx("flex-shrink-0"),
      children: /* @__PURE__ */ jsx(ImageIcon, {})
    }
  ) });
}
const FormatClearIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M20 8V5H6.39l3 3h1.83l-.55 1.28 2.09 2.1L14.21 8zM3.41 4.86 2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21l1.41-1.41z" }),
  "FormatClearOutlined"
);
function ClearFormatButton({ editor, size }) {
  return /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Clear formatting" }), children: /* @__PURE__ */ jsx(
    IconButton,
    {
      className: clsx("flex-shrink-0"),
      size,
      onClick: () => {
        editor.chain().focus().clearNodes().unsetAllMarks().run();
      },
      children: /* @__PURE__ */ jsx(FormatClearIcon, {})
    }
  ) });
}
const HorizontalRuleIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4 11h16v2H4z" }),
  "HorizontalRuleOutlined"
);
const PriorityHighIcon = createSvgIcon(
  [/* @__PURE__ */ jsx("circle", { cx: "12", cy: "19", r: "2" }, "0"), /* @__PURE__ */ jsx("path", { d: "M10 3h4v12h-4z" }, "1")],
  "PriorityHighOutlined"
);
const NoteIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M16 4H4c-1.1 0-2 .9-2 2v12.01c0 1.1.9 1.99 2 1.99h16c1.1 0 2-.9 2-2v-8l-6-6zM4 18.01V6h11v5h5v7.01H4z" }),
  "NoteOutlined"
);
const SmartDisplayIcon = createSvgIcon(
  [/* @__PURE__ */ jsx("path", { d: "M9.5 7.5v9l7-4.5z" }, "0"), /* @__PURE__ */ jsx("path", { d: "M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14.01H4V5.99h16v12.02z" }, "1")],
  "SmartDisplayOutlined"
);
function InsertMenuTrigger({ editor, size }) {
  const [dialog, setDialog] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment$1, { children: [
    /* @__PURE__ */ jsxs(
      MenuTrigger,
      {
        onItemSelected: (key) => {
          if (key === "hr") {
            editor.commands.focus();
            editor.commands.setHorizontalRule();
          } else if (key === "embed") {
            setDialog("embed");
          } else {
            editor.commands.focus();
            editor.commands.addInfo({ type: key });
          }
        },
        children: [
          /* @__PURE__ */ jsx(
            IconButton,
            {
              variant: "text",
              size,
              className: clsx("flex-shrink-0"),
              children: /* @__PURE__ */ jsx(MoreVertIcon, {})
            }
          ),
          /* @__PURE__ */ jsxs(Menu, { children: [
            /* @__PURE__ */ jsx(Item, { value: "hr", startIcon: /* @__PURE__ */ jsx(HorizontalRuleIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Horizontal rule" }) }),
            /* @__PURE__ */ jsx(Item, { value: "embed", startIcon: /* @__PURE__ */ jsx(SmartDisplayIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Embed" }) }),
            /* @__PURE__ */ jsx(Item, { value: "important", startIcon: /* @__PURE__ */ jsx(PriorityHighIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Important" }) }),
            /* @__PURE__ */ jsx(Item, { value: "warning", startIcon: /* @__PURE__ */ jsx(WarningIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Warning" }) }),
            /* @__PURE__ */ jsx(Item, { value: "success", startIcon: /* @__PURE__ */ jsx(NoteIcon, {}), children: /* @__PURE__ */ jsx(Trans, { message: "Note" }) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      DialogTrigger,
      {
        type: "modal",
        isOpen: !!dialog,
        onClose: () => {
          setDialog(false);
        },
        children: /* @__PURE__ */ jsx(EmbedDialog, { editor })
      }
    )
  ] });
}
function EmbedDialog({ editor }) {
  const previousSrc = editor.getAttributes("embed").src;
  const form = useForm({
    defaultValues: { src: previousSrc }
  });
  const { formId, close } = useDialogContext();
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { message: "Insert link" }) }),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx(
      Form$1,
      {
        form,
        id: formId,
        onSubmit: (value) => {
          editor.commands.setEmbed(value);
          close();
        },
        children: /* @__PURE__ */ jsx(
          FormTextField,
          {
            name: "src",
            label: /* @__PURE__ */ jsx(Trans, { message: "Embed URL" }),
            autoFocus: true,
            type: "url",
            required: true
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsx(Button, { onClick: close, variant: "text", children: /* @__PURE__ */ jsx(Trans, { message: "Cancel" }) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          form: formId,
          disabled: !form.formState.isValid,
          variant: "flat",
          color: "primary",
          children: /* @__PURE__ */ jsx(Trans, { message: "Add" })
        }
      )
    ] })
  ] });
}
function Keyboard({ children, modifier, separator = "+" }) {
  const modKey = isMac() ? /* @__PURE__ */ jsx("span", { className: "text-base align-middle", children: "⌘" }) : "Ctrl";
  return /* @__PURE__ */ jsxs("kbd", { className: "text-xs text-muted", children: [
    modifier && /* @__PURE__ */ jsxs(Fragment$1, { children: [
      modKey,
      separator
    ] }),
    children
  ] });
}
function FormatMenuTrigger({ editor, size }) {
  return /* @__PURE__ */ jsxs(
    MenuTrigger,
    {
      floatingMinWidth: "w-256",
      onItemSelected: (key) => {
        editor.commands.focus();
        if (typeof key === "string" && key.startsWith("h")) {
          editor.commands.toggleHeading({
            level: parseInt(key.replace("h", ""))
          });
        } else if (key === "code") {
          editor.commands.toggleCode();
        } else if (key === "strike") {
          editor.commands.toggleStrike();
        } else if (key === "super") {
          editor.commands.toggleSuperscript();
        } else if (key === "sub") {
          editor.commands.toggleSubscript();
        } else if (key === "blockquote") {
          editor.commands.toggleBlockquote();
        } else if (key === "paragraph") {
          editor.commands.setParagraph();
        }
      },
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            className: clsx("flex-shrink-0"),
            variant: "text",
            size,
            endIcon: /* @__PURE__ */ jsx(KeyboardArrowDownIcon, {}),
            children: /* @__PURE__ */ jsx(Trans, { message: "Format" })
          }
        ),
        /* @__PURE__ */ jsxs(Menu, { children: [
          /* @__PURE__ */ jsx(Item, { value: "h1", endSection: /* @__PURE__ */ jsx(Keyboard, { modifier: true, children: "Alt+1" }), children: /* @__PURE__ */ jsx(Trans, { message: "Heading :number", values: { number: 1 } }) }),
          /* @__PURE__ */ jsx(Item, { value: "h2", endSection: /* @__PURE__ */ jsx(Keyboard, { modifier: true, children: "Alt+2" }), children: /* @__PURE__ */ jsx(Trans, { message: "Heading :number", values: { number: 2 } }) }),
          /* @__PURE__ */ jsx(Item, { value: "h3", endSection: /* @__PURE__ */ jsx(Keyboard, { modifier: true, children: "Alt+3" }), children: /* @__PURE__ */ jsx(Trans, { message: "Heading :number", values: { number: 3 } }) }),
          /* @__PURE__ */ jsx(Item, { value: "h4", endSection: /* @__PURE__ */ jsx(Keyboard, { modifier: true, children: "Alt+4" }), children: /* @__PURE__ */ jsx(Trans, { message: "Heading :number", values: { number: 4 } }) }),
          /* @__PURE__ */ jsx(Item, { value: "code", endSection: /* @__PURE__ */ jsx(Keyboard, { modifier: true, children: "E" }), children: /* @__PURE__ */ jsx(Trans, { message: "Code" }) }),
          /* @__PURE__ */ jsx(
            Item,
            {
              value: "strike",
              endSection: /* @__PURE__ */ jsx(Keyboard, { modifier: true, children: "Shift+X" }),
              children: /* @__PURE__ */ jsx(Trans, { message: "Strikethrough" })
            }
          ),
          /* @__PURE__ */ jsx(
            Item,
            {
              value: "super",
              endSection: /* @__PURE__ */ jsx(Keyboard, { modifier: true, separator: " ", children: "." }),
              children: /* @__PURE__ */ jsx(Trans, { message: "Superscript" })
            }
          ),
          /* @__PURE__ */ jsx(
            Item,
            {
              value: "sub",
              endSection: /* @__PURE__ */ jsx(Keyboard, { modifier: true, separator: " ", children: "," }),
              children: /* @__PURE__ */ jsx(Trans, { message: "Subscript" })
            }
          ),
          /* @__PURE__ */ jsx(
            Item,
            {
              value: "blockquote",
              endSection: /* @__PURE__ */ jsx(Keyboard, { modifier: true, children: "Shift+B" }),
              children: /* @__PURE__ */ jsx(Trans, { message: "Blockquote" })
            }
          ),
          /* @__PURE__ */ jsx(
            Item,
            {
              value: "paragraph",
              endSection: /* @__PURE__ */ jsx(Keyboard, { modifier: true, children: "Alt+0" }),
              children: /* @__PURE__ */ jsx(Trans, { message: "Paragraph" })
            }
          )
        ] })
      ]
    }
  );
}
const FormatColorTextIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M2 20h20v4H2v-4zm3.49-3h2.42l1.27-3.58h5.65L16.09 17h2.42L13.25 3h-2.5L5.49 17zm4.42-5.61 2.03-5.79h.12l2.03 5.79H9.91z" }),
  "FormatColorTextOutlined"
);
const FormatColorFillIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M16.56 8.94 7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10 10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5zM2 20h20v4H2v-4z" }),
  "FormatColorFillOutlined"
);
function ColorButtons({ editor, size }) {
  const [dialog, setDialog] = useState(false);
  const textActive = editor.getAttributes("textStyle").color;
  const backgroundActive = editor.getAttributes("textStyle").backgroundColor;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("span", { className: clsx("flex-shrink-0 whitespace-nowrap"), children: [
      /* @__PURE__ */ jsx(
        IconButton,
        {
          size,
          color: textActive ? "primary" : null,
          onClick: () => {
            setDialog("text");
          },
          children: /* @__PURE__ */ jsx(FormatColorTextIcon, {})
        }
      ),
      /* @__PURE__ */ jsx(
        IconButton,
        {
          size,
          color: backgroundActive ? "primary" : null,
          onClick: () => {
            setDialog("bg");
          },
          children: /* @__PURE__ */ jsx(FormatColorFillIcon, {})
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      DialogTrigger,
      {
        defaultValue: dialog === "text" ? "#000000" : "#FFFFFF",
        type: "modal",
        isOpen: !!dialog,
        onClose: (newValue) => {
          if (newValue) {
            if (dialog === "text") {
              editor.commands.setColor(newValue);
            } else {
              editor.commands.setBackgroundColor(newValue);
            }
          }
          setDialog(false);
        },
        children: /* @__PURE__ */ jsx(ColorPickerDialog, {})
      }
    )
  ] });
}
const FormatAlignLeftIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" }),
  "FormatAlignLeftOutlined"
);
const FormatAlignCenterIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" }),
  "FormatAlignCenterOutlined"
);
const FormatAlignRightIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" }),
  "FormatAlignRightOutlined"
);
const FormatAlignJustifyIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z" }),
  "FormatAlignJustifyOutlined"
);
const iconMap = {
  left: {
    icon: FormatAlignLeftIcon,
    label: message("Align left")
  },
  center: {
    icon: FormatAlignCenterIcon,
    label: message("Align center")
  },
  right: {
    icon: FormatAlignRightIcon,
    label: message("Align right")
  },
  justify: {
    icon: FormatAlignJustifyIcon,
    label: message("Justify")
  }
};
function AlignButtons({ editor, size }) {
  const activeKey = Object.keys(iconMap).find((key) => {
    return editor.isActive({ textAlign: key });
  }) || "left";
  const ActiveIcon = activeKey ? iconMap[activeKey].icon : iconMap.left.icon;
  return /* @__PURE__ */ jsxs(
    MenuTrigger,
    {
      floatingWidth: "auto",
      selectionMode: "single",
      selectedValue: activeKey,
      onSelectionChange: (key) => {
        editor.commands.focus();
        editor.commands.setTextAlign(key);
      },
      children: [
        /* @__PURE__ */ jsx(
          IconButton,
          {
            size,
            color: activeKey ? "primary" : null,
            className: clsx("flex-shrink-0"),
            children: /* @__PURE__ */ jsx(ActiveIcon, {})
          }
        ),
        /* @__PURE__ */ jsx(Menu, { children: Object.entries(iconMap).map(([name, config]) => {
          const Icon = config.icon;
          return /* @__PURE__ */ jsx(
            Item,
            {
              value: name,
              startIcon: /* @__PURE__ */ jsx(Icon, { size: "md" }),
              capitalizeFirst: true,
              children: /* @__PURE__ */ jsx(Trans, { message: config.label.message })
            },
            name
          );
        }) })
      ]
    }
  );
}
const FormatIndentDecreaseIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M11 17h10v-2H11v2zm-8-5 4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z" }),
  "FormatIndentDecreaseOutlined"
);
const FormatIndentIncreaseIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z" }),
  "FormatIndentIncreaseOutlined"
);
function IndentButtons({ editor, size }) {
  return /* @__PURE__ */ jsxs("span", { className: clsx("flex-shrink-0", "whitespace-nowrap"), children: [
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Decrease indent" }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        size,
        onClick: () => {
          editor.commands.focus();
          editor.commands.outdent();
        },
        children: /* @__PURE__ */ jsx(FormatIndentDecreaseIcon, {})
      }
    ) }),
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Increase indent" }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        size,
        onClick: () => {
          editor.commands.focus();
          editor.commands.indent();
        },
        children: /* @__PURE__ */ jsx(FormatIndentIncreaseIcon, {})
      }
    ) })
  ] });
}
function CodeBlockMenuTrigger({ editor, size }) {
  const language = editor.getAttributes("codeBlock").language || "";
  return /* @__PURE__ */ jsxs(
    MenuTrigger,
    {
      selectionMode: "single",
      selectedValue: language,
      onSelectionChange: (key) => {
        editor.commands.toggleCodeBlock({ language: key });
      },
      children: [
        /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Codeblock" }), children: /* @__PURE__ */ jsx(
          IconButton,
          {
            className: clsx("flex-shrink-0"),
            size,
            color: language ? "primary" : null,
            children: /* @__PURE__ */ jsx(CodeIcon, {})
          }
        ) }),
        /* @__PURE__ */ jsxs(Menu, { children: [
          /* @__PURE__ */ jsx(Item, { value: "html", children: "HTML" }),
          /* @__PURE__ */ jsx(Item, { value: "javascript", children: "JavaScript" }),
          /* @__PURE__ */ jsx(Item, { value: "css", children: "CSS" }),
          /* @__PURE__ */ jsx(Item, { value: "php", children: "PHP" }),
          /* @__PURE__ */ jsx(Item, { value: "shell", children: "Shell" }),
          /* @__PURE__ */ jsx(Item, { value: "bash", children: "Bash" }),
          /* @__PURE__ */ jsx(Item, { value: "ruby", children: "Ruby" }),
          /* @__PURE__ */ jsx(Item, { value: "python", children: "Python" }),
          /* @__PURE__ */ jsx(Item, { value: "java", children: "Java" }),
          /* @__PURE__ */ jsx(Item, { value: "c++", children: "C++" })
        ] })
      ]
    }
  );
}
const MenubarRowClassName = "flex items-center px-4 h-42 text-muted border-b overflow-hidden";
function ArticleBodyEditorMenubar({
  editor,
  size = "md",
  justify = "justify-center",
  hideInsertButton = false,
  imageDiskPrefix
}) {
  const isMobile = useIsMobileMediaQuery();
  const [extendedVisible, setExtendedVisible] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: clsx(extendedVisible ? "h-84" : "h-42"), children: [
    /* @__PURE__ */ jsxs("div", { className: clsx(MenubarRowClassName, justify, "relative z-20"), children: [
      /* @__PURE__ */ jsx(FormatMenuTrigger, { editor, size }),
      /* @__PURE__ */ jsx(Divider, {}),
      /* @__PURE__ */ jsx(FontStyleButtons, { editor, size }),
      /* @__PURE__ */ jsx(Divider, {}),
      /* @__PURE__ */ jsx(AlignButtons, { editor, size }),
      /* @__PURE__ */ jsx(IndentButtons, { editor, size }),
      /* @__PURE__ */ jsx(Divider, {}),
      isMobile ? /* @__PURE__ */ jsx(
        IconButton,
        {
          className: "flex-shrink-0",
          color: extendedVisible ? "primary" : null,
          size,
          onClick: () => {
            setExtendedVisible(!extendedVisible);
          },
          children: extendedVisible ? /* @__PURE__ */ jsx(UnfoldLessIcon, {}) : /* @__PURE__ */ jsx(UnfoldMoreIcon, {})
        }
      ) : /* @__PURE__ */ jsx(
        ExtendedButtons,
        {
          editor,
          size,
          hideInsertButton,
          imageDiskPrefix
        }
      )
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: extendedVisible && /* @__PURE__ */ jsx(
      m.div,
      {
        className: clsx(
          MenubarRowClassName,
          justify,
          "absolute flex h-full w-full"
        ),
        initial: { y: "-100%" },
        animate: { y: 0 },
        exit: { y: "-100%" },
        children: /* @__PURE__ */ jsx(
          ExtendedButtons,
          {
            editor,
            size,
            imageDiskPrefix
          }
        )
      }
    ) })
  ] });
}
function ExtendedButtons({
  editor,
  size = "md",
  hideInsertButton,
  imageDiskPrefix
}) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ListButtons, { editor, size }),
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsx(LinkButton, { editor, size }),
    /* @__PURE__ */ jsx(ImageButton, { editor, size, diskPrefix: imageDiskPrefix }),
    !hideInsertButton && /* @__PURE__ */ jsx(InsertMenuTrigger, { editor, size }),
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsx(ColorButtons, { editor, size }),
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsx(CodeBlockMenuTrigger, { editor, size }),
    /* @__PURE__ */ jsx(ClearFormatButton, { editor, size })
  ] });
}
function ArticleEditorStickyHeader({
  editor,
  allowSlugEditing = true,
  onSave,
  saveButton,
  isLoading = false,
  backLink,
  slugPrefix = "pages",
  imageDiskPrefix
}) {
  const { isSticky, sentinelRef } = useStickySentinel();
  const isMobile = useIsMobileMediaQuery();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { ref: sentinelRef }),
    /* @__PURE__ */ jsxs("div", { className: clsx("sticky top-0 z-10 mb-20 bg", isSticky && "shadow"), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-20 border-b px-20 py-10 text-muted sm:justify-start", children: [
        !isMobile && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "text",
              size: "sm",
              elementType: Link,
              to: backLink,
              relative: "path",
              startIcon: /* @__PURE__ */ jsx(ArrowBackIcon, {}),
              children: /* @__PURE__ */ jsx(Trans, { message: "Back" })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mr-auto", children: allowSlugEditing && /* @__PURE__ */ jsx(
            FormSlugEditor,
            {
              name: "slug",
              showLinkIcon: false,
              prefix: slugPrefix
            }
          ) })
        ] }),
        editor && /* @__PURE__ */ jsx(HistoryButtons, { editor }),
        !isMobile && /* @__PURE__ */ jsx(ModeButton, { editor }),
        onSave && /* @__PURE__ */ jsx(
          SaveButton,
          {
            onSave: () => {
              onSave(editor.getHTML());
            },
            isLoading
          }
        ),
        saveButton
      ] }),
      /* @__PURE__ */ jsx(
        ArticleBodyEditorMenubar,
        {
          editor,
          size: "sm",
          imageDiskPrefix
        }
      )
    ] })
  ] });
}
function SaveButton({ onSave, isLoading }) {
  const form = useFormContext();
  const title = form.watch("title");
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant: "flat",
      size: "sm",
      color: "primary",
      className: "min-w-90",
      disabled: isLoading || !title,
      onClick: () => onSave(),
      children: /* @__PURE__ */ jsx(Trans, { message: "Save" })
    }
  );
}
function FormSlugEditor({ name, ...other }) {
  const {
    field: { onChange, onBlur, value = "", ref }
  } = useController({
    name
  });
  const manuallyChanged = useRef(false);
  const { watch, setValue } = useFormContext();
  useEffect(() => {
    const subscription = watch((formVal, { name: fieldName }) => {
      if (fieldName === "title" && !manuallyChanged.current) {
        setValue("slug", formVal.title);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);
  return /* @__PURE__ */ jsx(
    SlugEditor,
    {
      className: clsx(!value && "invisible"),
      onChange: (e) => {
        manuallyChanged.current = true;
        onChange(e);
      },
      onInputBlur: onBlur,
      value,
      inputRef: ref,
      ...other
    }
  );
}
const ArticleBodyEditor$1 = React.lazy(
  () => import("./article-body-editor-a8f82371.mjs")
);
function EditCustomPage() {
  const query = useCustomPage();
  return query.data ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageMetaTags, { query }),
    /* @__PURE__ */ jsx(PageContent, { page: query.data.page })
  ] }) : /* @__PURE__ */ jsx("div", { className: "relative w-full h-full", children: /* @__PURE__ */ jsx(PageStatus, { query }) });
}
function PageContent({ page }) {
  const navigate = useNavigate$1();
  const crupdatePage = useUpdateCustomPage();
  const form = useForm({
    defaultValues: {
      title: page.title,
      slug: page.slug,
      body: page.body
    }
  });
  const handleSave = (editorContent) => {
    crupdatePage.mutate(
      {
        ...form.getValues(),
        body: editorContent
      },
      {
        onSuccess: () => navigate("../..", { relative: "path" })
      }
    );
  };
  return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(FullPageLoader, {}), children: /* @__PURE__ */ jsx(ArticleBodyEditor$1, { initialContent: page.body, children: (content, editor) => /* @__PURE__ */ jsx(FileUploadProvider, { children: /* @__PURE__ */ jsxs(FormProvider, { ...form, children: [
    /* @__PURE__ */ jsx(
      ArticleEditorStickyHeader,
      {
        editor,
        backLink: "../..",
        isLoading: crupdatePage.isPending,
        onSave: handleSave
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mx-20", children: /* @__PURE__ */ jsxs("div", { className: "prose dark:prose-invert mx-auto flex-auto", children: [
      /* @__PURE__ */ jsx(ArticleEditorTitle, {}),
      content
    ] }) })
  ] }) }) }) });
}
function useCreateCustomPage(endpoint2) {
  const finalEndpoint = endpoint2 || "custom-pages";
  return useMutation({
    mutationFn: (payload) => createPage(payload, finalEndpoint),
    onError: (err) => showHttpErrorToast(err),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["custom-pages"] });
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey(finalEndpoint)
      });
      toast(message("Page created"));
    }
  });
}
function createPage(payload, endpoint2) {
  return apiClient.post(`${endpoint2}`, payload).then((r) => r.data);
}
const ArticleBodyEditor = React.lazy(
  () => import("./article-body-editor-a8f82371.mjs")
);
function CreateCustomPage() {
  const navigate = useNavigate$1();
  const createPage2 = useCreateCustomPage();
  const form = useForm();
  const handleSave = (editorContent) => {
    createPage2.mutate(
      {
        ...form.getValues(),
        body: editorContent
      },
      {
        onSuccess: () => navigate("../", { relative: "path" })
      }
    );
  };
  return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(FullPageLoader, {}), children: /* @__PURE__ */ jsx(ArticleBodyEditor, { children: (content, editor) => /* @__PURE__ */ jsx(FileUploadProvider, { children: /* @__PURE__ */ jsxs(FormProvider, { ...form, children: [
    /* @__PURE__ */ jsx(
      ArticleEditorStickyHeader,
      {
        editor,
        isLoading: createPage2.isPending,
        onSave: handleSave,
        backLink: "../"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "mx-20", children: /* @__PURE__ */ jsxs("div", { className: "prose dark:prose-invert mx-auto flex-auto", children: [
      /* @__PURE__ */ jsx(ArticleEditorTitle, {}),
      content
    ] }) })
  ] }) }) }) });
}
const fontImage = "/assets/font-a5a81d1a.svg";
function FontSelectorFilters({
  state: { filters, setFilters }
}) {
  const { trans } = useTrans();
  return /* @__PURE__ */ jsxs("div", { className: "mb-24 items-center gap-24 @xs:flex", children: [
    /* @__PURE__ */ jsx(
      TextField,
      {
        className: "mb-12 flex-auto @xs:mb-0",
        value: filters.query,
        onChange: (e) => {
          setFilters({
            ...filters,
            query: e.target.value
          });
        },
        startAdornment: /* @__PURE__ */ jsx(SearchIcon, {}),
        placeholder: trans(message("Search fonts"))
      }
    ),
    /* @__PURE__ */ jsxs(
      SelectForwardRef,
      {
        className: "flex-auto",
        selectionMode: "single",
        selectedValue: filters.category,
        onSelectionChange: (value) => {
          setFilters({
            ...filters,
            category: value
          });
        },
        children: [
          /* @__PURE__ */ jsx(Item, { value: "", children: /* @__PURE__ */ jsx(Trans, { message: "All categories" }) }),
          /* @__PURE__ */ jsx(Item, { value: "serif", children: /* @__PURE__ */ jsx(Trans, { message: "Serif" }) }),
          /* @__PURE__ */ jsx(Item, { value: "sans-serif", children: /* @__PURE__ */ jsx(Trans, { message: "Sans serif" }) }),
          /* @__PURE__ */ jsx(Item, { value: "display", children: /* @__PURE__ */ jsx(Trans, { message: "Display" }) }),
          /* @__PURE__ */ jsx(Item, { value: "handwriting", children: /* @__PURE__ */ jsx(Trans, { message: "Handwriting" }) }),
          /* @__PURE__ */ jsx(Item, { value: "monospace", children: /* @__PURE__ */ jsx(Trans, { message: "Monospace" }) })
        ]
      }
    )
  ] });
}
function useFilter(options) {
  const collator = useCollator({
    usage: "search",
    ...options
  });
  return {
    startsWith(string, substring) {
      if (substring.length === 0) {
        return true;
      }
      string = string.normalize("NFC");
      substring = substring.normalize("NFC");
      return collator.compare(string.slice(0, substring.length), substring) === 0;
    },
    endsWith(string, substring) {
      if (substring.length === 0) {
        return true;
      }
      string = string.normalize("NFC");
      substring = substring.normalize("NFC");
      return collator.compare(string.slice(-substring.length), substring) === 0;
    },
    contains(string, substring) {
      if (substring.length === 0) {
        return true;
      }
      string = string.normalize("NFC");
      substring = substring.normalize("NFC");
      let scan = 0;
      const sliceLen = substring.length;
      for (; scan + sliceLen <= string.length; scan++) {
        const slice = string.slice(scan, scan + sliceLen);
        if (collator.compare(substring, slice) === 0) {
          return true;
        }
      }
      return false;
    }
  };
}
const BrowserSafeFonts = [
  {
    label: message("System"),
    family: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    category: "sans-serif"
  },
  { family: "Impact, Charcoal, sans-serif", category: "sans-serif" },
  { family: "Arial, Helvetica Neue, Helvetica, sans-serif", category: "serif" },
  { family: '"Comic Sans MS", cursive, sans-serif', category: "Handwriting" },
  { family: "Century Gothic, sans-serif", category: "sans-serif" },
  { family: '"Courier New", Courier, monospace', category: "monospace" },
  {
    family: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
    category: "sans-serif"
  },
  { family: '"Times New Roman", Times, serif', category: "serif" },
  { family: '"Lucida Console", Monaco, monospace', category: "monospace" },
  { family: '"Andele Mono", monospace, sans-serif', category: "sans-serif" },
  { family: "Verdana, Geneva, sans-serif", category: "sans-serif" },
  {
    family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    category: "sans-serif"
  }
];
function useFontSelectorState({
  value,
  onChange
}) {
  const { data, isLoading } = useValueLists(["googleFonts"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilterState] = useState({
    query: "",
    category: (value == null ? void 0 : value.category) ?? ""
  });
  const { contains } = useFilter({
    sensitivity: "base"
  });
  const setFilters = useCallback((filters2) => {
    setFilterState(filters2);
    setCurrentPage(0);
  }, []);
  const allFonts = useMemo(() => {
    return BrowserSafeFonts.concat((data == null ? void 0 : data.googleFonts) ?? []);
  }, [data == null ? void 0 : data.googleFonts]);
  const filteredFonts = useMemo(() => {
    return allFonts.filter((font) => {
      var _a2;
      return contains(font.family, filters.query) && (!filters.category || ((_a2 = font.category) == null ? void 0 : _a2.toLowerCase()) === filters.category.toLowerCase());
    });
  }, [allFonts, filters, contains]);
  const pages2 = useMemo(() => {
    return chunkArray(filteredFonts, 20);
  }, [filteredFonts]);
  const fonts = pages2[currentPage];
  useEffect(() => {
    const id = "font-selector";
    if (fonts == null ? void 0 : fonts.length) {
      loadFonts(fonts, { id });
    }
  }, [fonts, currentPage]);
  return {
    fonts: fonts || [],
    currentPage,
    filteredFonts: filteredFonts || [],
    setCurrentPage,
    isLoading,
    filters,
    setFilters,
    value,
    onChange,
    pages: pages2
  };
}
function FontSelectorPagination({
  state: { currentPage = 0, setCurrentPage, filteredFonts, pages: pages2 }
}) {
  const total = (filteredFonts == null ? void 0 : filteredFonts.length) || 0;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-24 text-sm mt-30 pt-14 border-t", children: [
    total > 0 && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
      Trans,
      {
        message: ":from - :to of :total",
        values: {
          from: currentPage * 20 + 1,
          to: Math.min((currentPage + 1) * 20, total),
          total
        }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "text-muted", children: [
      /* @__PURE__ */ jsx(
        IconButton,
        {
          disabled: currentPage < 1,
          onClick: () => {
            setCurrentPage(Math.max(0, currentPage - 1));
          },
          children: /* @__PURE__ */ jsx(KeyboardArrowLeftIcon, {})
        }
      ),
      /* @__PURE__ */ jsx(
        IconButton,
        {
          disabled: currentPage >= pages2.length - 1,
          onClick: () => {
            setCurrentPage(currentPage + 1);
          },
          children: /* @__PURE__ */ jsx(KeyboardArrowRightIcon, {})
        }
      )
    ] })
  ] });
}
function FontSelector(props) {
  const state = useFontSelectorState(props);
  return /* @__PURE__ */ jsxs("div", { className: props.className, children: [
    /* @__PURE__ */ jsx(FontSelectorFilters, { state }),
    /* @__PURE__ */ jsx(AnimatePresence, { initial: false, mode: "wait", children: /* @__PURE__ */ jsx(FontList, { state }) }),
    /* @__PURE__ */ jsx(FontSelectorPagination, { state })
  ] });
}
function FontList({ state }) {
  const { isLoading, fonts } = state;
  const gridClassName = "grid gap-24 grid-cols-[repeat(auto-fill,minmax(90px,1fr))] items-start";
  if (isLoading) {
    return /* @__PURE__ */ jsx(FontListSkeleton, { className: gridClassName });
  }
  if (!(fonts == null ? void 0 : fonts.length)) {
    return /* @__PURE__ */ jsx(
      IllustratedMessage,
      {
        className: "mt-60",
        size: "sm",
        image: /* @__PURE__ */ jsx(SvgImage, { src: fontImage }),
        title: /* @__PURE__ */ jsx(Trans, { message: "No matching fonts" }),
        description: /* @__PURE__ */ jsx(Trans, { message: "Try another search query or different category" })
      }
    );
  }
  return /* @__PURE__ */ jsx(m.div, { ...opacityAnimation, className: gridClassName, children: fonts == null ? void 0 : fonts.map((font) => /* @__PURE__ */ jsx(FontButton, { font, state }, font.family)) }, "font-list");
}
function FontButton({ font, state: { value, onChange } }) {
  const isActive = (value == null ? void 0 : value.family) === font.family;
  const displayName = font.family.split(",")[0].replace(/"/g, "");
  return /* @__PURE__ */ jsxs(
    ButtonBase,
    {
      display: "block",
      onClick: () => {
        onChange(font);
      },
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: clsx(
              "flex aspect-square items-center justify-center rounded-panel border text-4xl transition-bg-color hover:bg-hover md:text-5xl",
              isActive && "ring-2 ring-primary ring-offset-2"
            ),
            children: /* @__PURE__ */ jsx("span", { style: { fontFamily: font.family }, children: "Aa" })
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            className: clsx(
              "mt-6 block overflow-hidden overflow-ellipsis whitespace-nowrap text-sm",
              isActive && "text-primary"
            ),
            children: font.label ? /* @__PURE__ */ jsx(Trans, { ...font.label }) : displayName
          }
        )
      ]
    },
    font.family
  );
}
function FontListSkeleton({ className }) {
  const items = Array.from(Array(20).keys());
  return /* @__PURE__ */ jsx(m.div, { ...opacityAnimation, className, children: items.map((index) => /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "aspect-square", children: /* @__PURE__ */ jsx(Skeleton, { display: "block", variant: "rect" }) }),
    /* @__PURE__ */ jsx(Skeleton, { className: "mt-6 text-sm" })
  ] }, index)) }, "font-list-skeleton");
}
function ThemeFontPanel() {
  const { setValue, watch } = useFormContext();
  const { themeIndex } = useParams();
  const key = `appearance.themes.all.${themeIndex}.font`;
  return /* @__PURE__ */ jsx(
    FontSelector,
    {
      value: watch(key),
      onChange: (font) => {
        setValue(key, font, { shouldDirty: true });
        appearanceState().preview.setThemeFont(font);
      }
    }
  );
}
const radiusMap = {
  "rounded-none": {
    label: message("Square"),
    value: "0px"
  },
  "rounded-sm": {
    label: message("Small"),
    value: "0.125rem"
  },
  "rounded-md": {
    label: message("Medium"),
    value: "0.25rem"
  },
  "rounded-lg": {
    label: message("Large"),
    value: "0.5rem"
  },
  "rounded-xl": {
    label: message("Larger"),
    value: "0.75rem"
  },
  "rounded-full": {
    label: message("Pill"),
    value: "9999px"
  }
};
function ThemeRadiusPanel() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-24", children: [
    /* @__PURE__ */ jsx(
      RadiusSelector,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Button rounding" }),
        name: "button-radius"
      }
    ),
    /* @__PURE__ */ jsx(
      RadiusSelector,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Input rounding" }),
        name: "input-radius"
      }
    ),
    /* @__PURE__ */ jsx(
      RadiusSelector,
      {
        label: /* @__PURE__ */ jsx(Trans, { message: "Panel rounding" }),
        name: "panel-radius",
        hidePill: true
      }
    )
  ] });
}
function RadiusSelector({ label, name, hidePill }) {
  const { themeIndex } = useParams();
  const { watch, setValue } = useFormContext();
  const formKey = `appearance.themes.all.${themeIndex}.values.--be-${name}`;
  const currentValue = watch(formKey);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("div", { className: "mb-10 text-sm font-semibold", children: label }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-10 text-sm", children: Object.entries(radiusMap).filter(([key]) => !hidePill || !key.includes("full")).map(([key, { label: label2, value }]) => /* @__PURE__ */ jsx(
      PreviewButton,
      {
        radius: key,
        isActive: value === currentValue,
        onClick: () => {
          setValue(formKey, value, { shouldDirty: true });
        },
        children: /* @__PURE__ */ jsx(Trans, { ...label2 })
      },
      key
    )) })
  ] });
}
function PreviewButton({
  radius,
  children,
  isActive,
  onClick
}) {
  return /* @__PURE__ */ jsx(
    ButtonBase,
    {
      display: "block",
      className: clsx(
        "h-36 border-2 hover:bg-hover",
        radius,
        isActive && "border-primary"
      ),
      onClick,
      children
    }
  );
}
const tabs = ["schedule", "error", "outgoing-email"];
function LogsPage() {
  const { pathname } = useLocation();
  const activeTab = pathname.split("/").pop();
  const activeIndex = tabs.includes(activeTab) ? tabs.indexOf(activeTab) : 0;
  return /* @__PURE__ */ jsxs(Tabs, { className: "p-12 md:p-24", selectedTab: activeIndex, children: [
    /* @__PURE__ */ jsxs(TabList, { children: [
      /* @__PURE__ */ jsx(Tab, { elementType: Link, to: "/admin/logs/schedule", replace: true, children: /* @__PURE__ */ jsx(Trans, { message: "Schedule" }) }),
      /* @__PURE__ */ jsx(Tab, { elementType: Link, to: "/admin/logs/error", replace: true, children: /* @__PURE__ */ jsx(Trans, { message: "Error" }) }),
      /* @__PURE__ */ jsx(Tab, { elementType: Link, to: "/admin/logs/outgoing-email", replace: true, children: /* @__PURE__ */ jsx(Trans, { message: "Email" }) })
    ] }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
}
function BooleanIndicator({ value }) {
  if (value) {
    return /* @__PURE__ */ jsx(CheckIcon, { className: "icon-md text-positive" });
  }
  return /* @__PURE__ */ jsx(CloseIcon, { className: "icon-md text-danger" });
}
function useRerunScheduledCommand() {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: (payload) => rerunCommand(payload),
    onSuccess: async (response, props) => {
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey("logs/schedule")
      });
      toast.positive(trans(message("Command reran")));
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function rerunCommand({ id }) {
  return apiClient.post(`logs/schedule/rerun/${id}`).then((r) => r.data);
}
const EventRepeatIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M21 12V6c0-1.1-.9-2-2-2h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V10h14v2h2zm-2-4H5V6h14v2zm-3.36 12c.43 1.45 1.77 2.5 3.36 2.5 1.93 0 3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5c-.95 0-1.82.38-2.45 1H18V18h-4v-4h1.5v1.43c.9-.88 2.14-1.43 3.5-1.43 2.76 0 5 2.24 5 5s-2.24 5-5 5c-2.42 0-4.44-1.72-4.9-4h1.54z" }),
  "EventRepeatOutlined"
);
const ScheduleDatatableColumns = [
  {
    key: "command",
    allowsSorting: true,
    visibleInMode: "all",
    width: "flex-3 min-w-200",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Name" }),
    body: (item) => /* @__PURE__ */ jsx(NameWithAvatar, { label: item.command, description: item.output })
  },
  {
    key: "ran_at",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Ran at" }),
    body: (item) => /* @__PURE__ */ jsx(FormattedRelativeTime, { date: item.ran_at })
  },
  {
    key: "duration",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Duration" }),
    body: (item) => `${item.duration}ms`
  },
  {
    key: "exit_code",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Completed" }),
    body: (item) => /* @__PURE__ */ jsx(BooleanIndicator, { value: item.exit_code === 0 })
  },
  {
    key: "count_in_last_hour",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Runs recently" }),
    body: (item) => /* @__PURE__ */ jsx(FormattedNumber, { value: item.count_in_last_hour })
  },
  {
    key: "actions",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    hideHeader: true,
    align: "end",
    width: "w-42 flex-shrink-0",
    visibleInMode: "all",
    body: (item) => /* @__PURE__ */ jsx(RerunButton, { item })
  }
];
function RerunButton({ item }) {
  const rerunCommand2 = useRerunScheduledCommand();
  return /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Rerun now" }), children: /* @__PURE__ */ jsx(
    IconButton,
    {
      size: "md",
      className: "text-muted",
      disabled: rerunCommand2.isPending,
      onClick: () => {
        rerunCommand2.mutate({ id: item.id });
      },
      children: /* @__PURE__ */ jsx(EventRepeatIcon, {})
    }
  ) });
}
const timelineImage = "/assets/timeline-172fbeee.svg";
const DownloadIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z" }),
  "DownloadOutlined"
);
function ScheduleLogDatatable() {
  return /* @__PURE__ */ jsx(
    DataTablePage,
    {
      padding: "pt-12 md:pt-24",
      endpoint: "logs/schedule",
      title: /* @__PURE__ */ jsx(Trans, { message: "CRON schedule log" }),
      columns: ScheduleDatatableColumns,
      actions: /* @__PURE__ */ jsx(Actions$2, {}),
      enableSelection: false,
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: timelineImage,
          title: /* @__PURE__ */ jsx(Trans, { message: "No scheduled commands have ran yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching scheduled commands" })
        }
      )
    }
  );
}
function Actions$2() {
  return /* @__PURE__ */ jsx(
    DataTableAddItemButton,
    {
      elementType: "a",
      href: "api/v1/logs/schedule/download",
      download: true,
      icon: /* @__PURE__ */ jsx(DownloadIcon, {}),
      children: /* @__PURE__ */ jsx(Trans, { message: "Download log" })
    }
  );
}
const bugFixingImage = "/assets/bug-fixing-bd601a66.svg";
const ErrorLogDatatableColumns = [
  {
    key: "message",
    visibleInMode: "all",
    width: "flex-3 min-w-200",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Message" }),
    body: (item) => item.message
  },
  {
    key: "datetime",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Date" }),
    body: (item) => /* @__PURE__ */ jsx(FormattedRelativeTime, { date: item.datetime })
  },
  {
    key: "severity",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Severity" }),
    body: (item) => {
      return /* @__PURE__ */ jsxs(
        "span",
        {
          className: clsx(
            "flex items-center gap-6 text-xs capitalize",
            item.level === "error" ? "text-danger" : "text-primary"
          ),
          children: [
            item.level === "error" ? /* @__PURE__ */ jsx(ErrorIcon, { size: "sm" }) : /* @__PURE__ */ jsx(InfoIcon, { size: "sm" }),
            item.level
          ]
        }
      );
    }
  }
];
function ErrorLogEntryDialog({ error }) {
  return /* @__PURE__ */ jsxs(Dialog, { size: "fullscreen", children: [
    /* @__PURE__ */ jsx(
      DialogHeader,
      {
        showDivider: true,
        padding: "px-24 py-10",
        actions: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "xs",
            onClick: () => downloadLogItem(error),
            children: /* @__PURE__ */ jsx(Trans, { message: "Download" })
          }
        ),
        children: /* @__PURE__ */ jsx(Trans, { message: "Error details" })
      }
    ),
    /* @__PURE__ */ jsx(DialogBody, { children: /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap break-words text-xs leading-5", children: error.exception }) })
  ] });
}
function downloadLogItem(item) {
  const el = document.createElement("a");
  el.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(item.exception)
  );
  el.setAttribute("download", `error-${item.id}.log`);
  el.style.display = "none";
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}
function useDeleteErrorLog() {
  const { trans } = useTrans();
  return useMutation({
    mutationFn: (payload) => deleteLogFile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey("logs/error")
      });
      toast(trans(message("Log file deleted")));
    },
    onError: (err) => showHttpErrorToast(err)
  });
}
function deleteLogFile({ identifier }) {
  return apiClient.delete(`logs/error/${identifier}`).then((r) => r.data);
}
function ErrorLogDatatable() {
  return /* @__PURE__ */ jsx(
    DataTablePage,
    {
      padding: "pt-12 md:pt-24",
      endpoint: "logs/error",
      title: /* @__PURE__ */ jsx(Trans, { message: "Error log" }),
      onRowAction: (item) => {
        openDialog(ErrorLogEntryDialog, { error: item });
      },
      columns: ErrorLogDatatableColumns,
      actions: /* @__PURE__ */ jsx(Actions$1, {}),
      enableSelection: false,
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: bugFixingImage,
          title: /* @__PURE__ */ jsx(Trans, { message: "No errors have been logged yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching error log entries" })
        }
      )
    }
  );
}
function Actions$1() {
  var _a2, _b, _c;
  const { query, setParams } = useDataTable();
  const setOnce = useRef(false);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    var _a3, _b2;
    if (((_b2 = (_a3 = query.data) == null ? void 0 : _a3.files) == null ? void 0 : _b2.length) && !setOnce.current) {
      setOnce.current = true;
      const firstFile = query.data.files[0].identifier;
      setSelectedFile(query.data.files[0].identifier);
      if (firstFile !== query.data.selectedFile) {
        setParams({ file: query.data.files[0].identifier });
      }
    }
  }, [query.data, setParams, setOnce]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FileSelector,
      {
        files: ((_a2 = query.data) == null ? void 0 : _a2.files) ?? null,
        selectedFile,
        onSelected: (file) => {
          setSelectedFile(file.identifier);
          setParams({ file: file.identifier });
        }
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        color: "danger",
        disabled: !selectedFile,
        onClick: () => openDialog(ConfirmDeleteDialog, { identifier: selectedFile }),
        children: /* @__PURE__ */ jsx(Trans, { message: "Delete" })
      }
    ),
    selectedFile && /* @__PURE__ */ jsx(
      DataTableAddItemButton,
      {
        elementType: "a",
        download: (_c = (_b = query.data) == null ? void 0 : _b.files.find((f) => f.identifier === selectedFile)) == null ? void 0 : _c.name,
        href: `api/v1/logs/error/${selectedFile}/download`,
        icon: /* @__PURE__ */ jsx(DownloadIcon, {}),
        children: /* @__PURE__ */ jsx(Trans, { message: "Download log" })
      }
    )
  ] });
}
function FileSelector({ files, selectedFile, onSelected }) {
  if (!files) {
    return /* @__PURE__ */ jsx(Skeleton, { variant: "rect", className: "max-w-[210px]" });
  }
  if (!files.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    SelectForwardRef,
    {
      selectionMode: "single",
      selectedValue: selectedFile,
      size: "sm",
      minWidth: "min-w-[210px]",
      children: files == null ? void 0 : files.map((file) => /* @__PURE__ */ jsxs(
        Item,
        {
          value: file.identifier,
          onSelected: () => onSelected(file),
          children: [
            file.name,
            " (",
            /* @__PURE__ */ jsx(FormattedBytes, { bytes: file.size }),
            ")"
          ]
        },
        file.identifier
      ))
    }
  );
}
function ConfirmDeleteDialog({ identifier }) {
  const deleteLog = useDeleteErrorLog();
  return /* @__PURE__ */ jsx(
    ConfirmationDialog,
    {
      title: /* @__PURE__ */ jsx(Trans, { message: "Delete log file" }),
      body: /* @__PURE__ */ jsx(Trans, { message: "Are you sure you want to delete this log file?" }),
      confirm: /* @__PURE__ */ jsx(Trans, { message: "Delete" }),
      onConfirm: () => deleteLog.mutate({ identifier }, { onSuccess: () => closeDialog() }),
      isLoading: deleteLog.isPending,
      isDanger: true
    }
  );
}
const openedImage = "/assets/opened-4dded9dc.svg";
function useOutgoingEmailLogItemWithMime(id) {
  return useQuery({
    queryKey: ["logs/outgoing-email", id],
    queryFn: () => fetchLogItem(id)
  });
}
function fetchLogItem(id) {
  return apiClient.get(`logs/outgoing-email/${id}`).then((r) => r.data);
}
function OutgoingEmailLogEntryDialog({ logItemId }) {
  const { data } = useOutgoingEmailLogItemWithMime(logItemId);
  const { base_url } = useSettings();
  return /* @__PURE__ */ jsxs(Dialog, { size: "fullscreen", children: [
    /* @__PURE__ */ jsx(
      DialogHeader,
      {
        showDivider: true,
        padding: "px-24 py-10",
        actions: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "xs",
            disabled: !data,
            type: "button",
            onClick: data ? () => downloadFileFromUrl(
              `${base_url}/api/v1/logs/outgoing-email/${logItemId}/download`
            ) : void 0,
            children: /* @__PURE__ */ jsx(Trans, { message: "Download" })
          }
        ),
        children: /* @__PURE__ */ jsx(Trans, { message: "Email preview" })
      }
    ),
    /* @__PURE__ */ jsx(DialogBody, { children: data ? /* @__PURE__ */ jsx(
      "iframe",
      {
        srcDoc: data.logItem.parsed_message.body.html,
        className: "h-max w-full border-none",
        onLoad: (e) => {
          const iframe = e.target;
          iframe.style.height = iframe.contentWindow.document.body.scrollHeight + "px";
        }
      }
    ) : /* @__PURE__ */ jsx("div", { className: "flex min-h-200 items-center justify-center", children: /* @__PURE__ */ jsx(ProgressCircle, { isIndeterminate: true }) }) })
  ] });
}
const OutgoingEmailLogDatatableColumns = [
  {
    key: "message_id",
    allowsSorting: true,
    visibleInMode: "all",
    width: "flex-3 min-w-200",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Subject" }),
    body: (item) => /* @__PURE__ */ jsx(NameWithAvatar, { label: item.subject, description: item.message_id })
  },
  {
    key: "status",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Status" }),
    body: (item) => {
      switch (item.status) {
        case "sent":
          return /* @__PURE__ */ jsx(StatusChip, { color: "positive", children: /* @__PURE__ */ jsx(Trans, { message: "Sent" }) });
        case "not-sent":
          return /* @__PURE__ */ jsx(StatusChip, { color: void 0, children: /* @__PURE__ */ jsx(Trans, { message: "Not sent" }) });
        case "error":
          return /* @__PURE__ */ jsx(StatusChip, { color: "danger", children: /* @__PURE__ */ jsx(Trans, { message: "Error" }) });
      }
    }
  },
  {
    key: "from",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "From" }),
    body: (item) => item.from
  },
  {
    key: "to",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "To" }),
    body: (item) => item.to
  },
  {
    key: "created_at",
    allowsSorting: true,
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Date" }),
    body: (item) => /* @__PURE__ */ jsx(FormattedRelativeTime, { date: item.created_at })
  },
  {
    key: "actions",
    header: () => /* @__PURE__ */ jsx(Trans, { message: "Actions" }),
    hideHeader: true,
    align: "end",
    width: "w-42 flex-shrink-0",
    visibleInMode: "all",
    body: (item) => /* @__PURE__ */ jsx(PreviewEmailButton, { item })
  }
];
function PreviewEmailButton({ item }) {
  const rerunCommand2 = useRerunScheduledCommand();
  return /* @__PURE__ */ jsxs(DialogTrigger, { type: "modal", children: [
    /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Preview" }), children: /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "md",
        className: "text-muted",
        disabled: rerunCommand2.isPending,
        onClick: () => {
          rerunCommand2.mutate({ id: item.id });
        },
        children: /* @__PURE__ */ jsx(VisibilityIcon, {})
      }
    ) }),
    /* @__PURE__ */ jsx(OutgoingEmailLogEntryDialog, { logItemId: item.id })
  ] });
}
function StatusChip({ color, children }) {
  return /* @__PURE__ */ jsx(Chip, { color, size: "xs", className: "w-max min-w-50 text-center", children });
}
const OutgoingEmailLogDatatableFilters = [
  {
    key: "status",
    label: message("Status"),
    description: message("Status of the outgoing email"),
    defaultOperator: FilterOperator.eq,
    control: {
      type: FilterControlType.Select,
      defaultValue: "01",
      options: [
        {
          key: "01",
          label: message("Not sent"),
          value: "no-sent"
        },
        {
          key: "02",
          label: message("Sent"),
          value: "sent"
        },
        {
          key: "03",
          label: message("Error"),
          value: "error"
        }
      ]
    }
  },
  createdAtFilter({
    description: message("Date email send was attempted")
  })
];
function OutgoingEmailLogDatatable() {
  return /* @__PURE__ */ jsx(
    DataTablePage,
    {
      padding: "pt-12 md:pt-24",
      endpoint: "logs/outgoing-email",
      title: /* @__PURE__ */ jsx(Trans, { message: "Outgoing email" }),
      columns: OutgoingEmailLogDatatableColumns,
      filters: OutgoingEmailLogDatatableFilters,
      actions: /* @__PURE__ */ jsx(Actions, {}),
      enableSelection: false,
      emptyStateMessage: /* @__PURE__ */ jsx(
        DataTableEmptyStateMessage,
        {
          image: openedImage,
          title: /* @__PURE__ */ jsx(Trans, { message: "No outgoing emails have been logged yet" }),
          filteringTitle: /* @__PURE__ */ jsx(Trans, { message: "No matching emails" })
        }
      )
    }
  );
}
function Actions() {
  return /* @__PURE__ */ jsx(
    DataTableAddItemButton,
    {
      elementType: "a",
      href: "api/v1/logs/outgoing-email/download",
      download: true,
      icon: /* @__PURE__ */ jsx(DownloadIcon, {}),
      children: /* @__PURE__ */ jsx(Trans, { message: "Download log" })
    }
  );
}
const ReportsPage = React.lazy(() => import("./admin-report-page-e5ef703f.mjs"));
const AdminRouteConfig = [
  {
    path: "appearance",
    element: /* @__PURE__ */ jsx(AuthRoute, { permission: "appearance.update", children: /* @__PURE__ */ jsx(AppearanceLayout, {}) }),
    children: [
      { index: true, element: /* @__PURE__ */ jsx(SectionList, {}) },
      { path: "general", element: /* @__PURE__ */ jsx(GeneralSection, {}) },
      { path: "seo-settings", element: /* @__PURE__ */ jsx(SeoSection, {}) },
      { path: "custom-code", element: /* @__PURE__ */ jsx(CustomCodeSection, {}) },
      { path: "themes", element: /* @__PURE__ */ jsx(ThemeList, {}) },
      { path: "themes/:themeIndex", element: /* @__PURE__ */ jsx(ThemeEditor, {}) },
      { path: "themes/:themeIndex/font", element: /* @__PURE__ */ jsx(ThemeFontPanel, {}) },
      { path: "themes/:themeIndex/radius", element: /* @__PURE__ */ jsx(ThemeRadiusPanel, {}) },
      { path: "menus", element: /* @__PURE__ */ jsx(MenuList, {}) },
      { path: "menus/:menuIndex", element: /* @__PURE__ */ jsx(MenuEditor, {}) },
      {
        path: "menus/:menuIndex/items/:menuItemIndex",
        element: /* @__PURE__ */ jsx(MenuItemEditor, {})
      },
      ...Object.values(AppAppearanceConfig.sections).flatMap(
        (s) => s.routes || []
      )
    ]
  },
  {
    path: "/",
    element: /* @__PURE__ */ jsx(AdminLayout, {}),
    children: [
      ...AppAdminRoutes,
      // REPORT PAGE
      {
        path: "/",
        element: /* @__PURE__ */ jsx(React.Suspense, { fallback: /* @__PURE__ */ jsx(FullPageLoader, { screen: true }), children: /* @__PURE__ */ jsx(ReportsPage, {}) })
      },
      // USERS
      {
        path: "users",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "users.update", children: /* @__PURE__ */ jsx(UserDatatable, {}) })
      },
      {
        path: "users/new",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "users.update", children: /* @__PURE__ */ jsx(CreateUserPage, {}) })
      },
      {
        path: "users/:userId/edit",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "users.update", children: /* @__PURE__ */ jsx(UpdateUserPage, {}) })
      },
      // ROLES
      {
        path: "roles",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "roles.update", children: /* @__PURE__ */ jsx(RolesIndexPage, {}) })
      },
      {
        path: "roles/new",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "roles.update", children: /* @__PURE__ */ jsx(CreateRolePage, {}) })
      },
      {
        path: "roles/:roleId/edit",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "roles.update", children: /* @__PURE__ */ jsx(EditRolePage, {}) })
      },
      // SUBSCRIPTIONS and PLANS
      {
        path: "subscriptions",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "subscriptions.update", children: /* @__PURE__ */ jsx(SubscriptionsIndexPage, {}) })
      },
      {
        path: "plans",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "plans.update", children: /* @__PURE__ */ jsx(PlansIndexPage, {}) })
      },
      {
        path: "plans/new",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "plans.update", children: /* @__PURE__ */ jsx(CreatePlanPage, {}) })
      },
      {
        path: "plans/:productId/edit",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "plans.update", children: /* @__PURE__ */ jsx(EditPlanPage, {}) })
      },
      // CUSTOM PAGES
      {
        path: "custom-pages",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "custom_pages.update", children: /* @__PURE__ */ jsx(CustomPageDatablePage, {}) })
      },
      {
        path: "custom-pages/new",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "custom_pages.update", children: /* @__PURE__ */ jsx(CreateCustomPage, {}) })
      },
      {
        path: "custom-pages/:pageId/edit",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "custom_pages.update", children: /* @__PURE__ */ jsx(EditCustomPage, {}) })
      },
      // TAGS
      {
        path: "tags",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "tags.update", children: /* @__PURE__ */ jsx(TagIndexPage, {}) })
      },
      // LOCALIZATIONS
      {
        path: "localizations",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "localizations.update", children: /* @__PURE__ */ jsx(LocalizationIndex, {}) })
      },
      {
        path: "localizations/:localeId/translate",
        element: /* @__PURE__ */ jsx(TranslationManagementPage, {})
      },
      // FILE ENTRIES
      {
        path: "files",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "files.update", children: /* @__PURE__ */ jsx(FileEntryIndexPage, {}) })
      },
      // ADS
      {
        path: "ads",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "settings.update", children: /* @__PURE__ */ jsx(AdsPage, {}) })
      },
      // SETTINGS
      {
        path: "settings",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "settings.update", children: /* @__PURE__ */ jsx(SettingsLayout, {}) }),
        children: [
          { index: true, element: /* @__PURE__ */ jsx(Navigate, { to: "general", replace: true }) },
          { path: "general", element: /* @__PURE__ */ jsx(GeneralSettings, {}) },
          { path: "subscriptions", element: /* @__PURE__ */ jsx(SubscriptionSettings, {}) },
          { path: "localization", element: /* @__PURE__ */ jsx(LocalizationSettings, {}) },
          { path: "authentication", element: /* @__PURE__ */ jsx(AuthenticationSettings, {}) },
          { path: "uploading", element: /* @__PURE__ */ jsx(UploadingSettings, {}) },
          { path: "outgoing-email", element: /* @__PURE__ */ jsx(OutgoingEmailSettings, {}) },
          { path: "cache", element: /* @__PURE__ */ jsx(CacheSettings, {}) },
          { path: "analytics", element: /* @__PURE__ */ jsx(ReportsSettings, {}) },
          { path: "logging", element: /* @__PURE__ */ jsx(LoggingSettings, {}) },
          { path: "queue", element: /* @__PURE__ */ jsx(QueueSettings, {}) },
          { path: "recaptcha", element: /* @__PURE__ */ jsx(RecaptchaSettings, {}) },
          { path: "gdpr", element: /* @__PURE__ */ jsx(GdprSettings, {}) },
          ...AppSettingsRoutes
        ]
      },
      // LOGS
      {
        path: "logs",
        element: /* @__PURE__ */ jsx(AuthRoute, { permission: "logs.view", children: /* @__PURE__ */ jsx(LogsPage, {}) }),
        children: [
          { index: true, element: /* @__PURE__ */ jsx(ScheduleLogDatatable, {}) },
          { path: "schedule", element: /* @__PURE__ */ jsx(ScheduleLogDatatable, {}) },
          { path: "error", element: /* @__PURE__ */ jsx(ErrorLogDatatable, {}) },
          { path: "outgoing-email", element: /* @__PURE__ */ jsx(OutgoingEmailLogDatatable, {}) }
        ]
      }
    ]
  },
  { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) }
];
function AdminRoutes() {
  return useRoutes(AdminRouteConfig);
}
const adminRoutes = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminRoutes
}, Symbol.toStringTag, { value: "Module" }));
export {
  adminRoutes as A,
  CodeIcon as C,
  DownloadIcon as D,
  EventRepeatIcon as E,
  FormattedBytes as F,
  HorizontalRuleIcon as H,
  ImageIcon as I,
  NoteIcon as N,
  PauseIcon as P,
  RedoIcon as R,
  SmartDisplayIcon as S,
  TranslateIcon as T,
  UndoIcon as U,
  VisibilityIcon as V,
  DragIndicatorIcon as a,
  FilterAltIcon as b,
  FormatAlignCenterIcon as c,
  FormatAlignJustifyIcon as d,
  FormatAlignLeftIcon as e,
  FormatAlignRightIcon as f,
  FormatBoldIcon as g,
  FormatClearIcon as h,
  FormatColorFillIcon as i,
  FormatColorTextIcon as j,
  FormatIndentDecreaseIcon as k,
  FormatIndentIncreaseIcon as l,
  FormatItalicIcon as m,
  FormatListBulletedIcon as n,
  FormatListNumberedIcon as o,
  FormatUnderlinedIcon as p,
  PersonOffIcon as q,
  PlayArrowIcon as r,
  PriorityHighIcon as s,
  themeValueToHex as t,
  ReportIcon as u,
  RestartAltIcon as v,
  SyncIcon as w,
  TuneIcon as x,
  useFilter as y,
  iconGridStyle as z
};
//# sourceMappingURL=admin-routes-58f03d5a.mjs.map
