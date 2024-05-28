var _a, _b;
import { jsx, jsxs } from "react/jsx-runtime";
import React, { createContext, useEffect, useMemo, useCallback, cloneElement, useContext, useState, useRef, Fragment, memo, useId, forwardRef, Children, isValidElement, useLayoutEffect as useLayoutEffect$1 } from "react";
import { b4 as useMediaQuery, aN as getFromLocalStorage, s as setInLocalStorage, b7 as Underlay, f as createSvgIcon, aP as Navbar, e as IconButton, ad as getBootstrapData, m as message, U as getInputFieldClassNames, am as useField, an as Field, b8 as useUserTimezone, c as useIsMobileMediaQuery, b9 as useSelectedLocale, ba as useDateFormatter, K as KeyboardArrowLeftIcon, u as useSettings, aj as DateFormatPresets, b2 as shallowEqual, $ as List, a0 as ListItem, T as Trans, bb as useAutoFocus, g as useDialogContext, G as DialogFooter, B as Button, D as Dialog, i as DialogBody, k as DialogTrigger, W as createEventHandler, bc as useIsDarkMode, q as Skeleton, j as Checkbox, l as useTrans, a2 as FormSelect, I as Item, bd as AvatarPlaceholderIcon, Q as Tooltip, a as apiClient, S as SelectForwardRef, p as opacityAnimation, J as FormTextField, N as Chip, be as useListbox, bf as Listbox, bg as Popover, a7 as ProgressCircle, aB as KeyboardArrowDownIcon, bh as useListboxKeyboardNavigation, h as DialogHeader, F as Form, d as useNumberFormatter, M as CloseIcon, aU as UploadedFile, bi as isAbsoluteUrl, av as FileTypeIcon } from "../server-entry.mjs";
import { AnimatePresence, m } from "framer-motion";
import { useControlledState } from "@react-stately/utils";
import clsx from "clsx";
import { FocusScope, createFocusManager, useFocusManager, getFocusableTreeWalker } from "@react-aria/focus";
import { useObjectRef, mergeProps, isMac, focusWithoutScrolling, useGlobalListeners, useLayoutEffect } from "@react-aria/utils";
import { useInteractOutside } from "@react-aria/interactions";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useController, useFormContext, useForm } from "react-hook-form";
import { E as EditIcon, C as ChevronRightIcon } from "./Edit-48c44acf.mjs";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getLocalTimeZone, now, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, CalendarDate, toZoned, maxDate, minDate, isSameDay, toCalendarDate, isSameMonth, today, getMinimumDayInMonth, getMinimumMonthInYear, getDayOfWeek, isToday, getWeeksInMonth, parseAbsolute, parseAbsoluteToLocal } from "@internationalized/date";
import { NumberParser } from "@internationalized/number";
const DashboardLayoutContext = createContext(
  null
);
function useBlockBodyOverflow(disable = false) {
  useEffect(() => {
    if (disable) {
      document.documentElement.classList.remove("no-page-overflow");
    } else {
      document.documentElement.classList.add("no-page-overflow");
    }
    return () => {
      document.documentElement.classList.remove("no-page-overflow");
    };
  }, [disable]);
}
function DashboardLayout({
  children,
  leftSidenavStatus: leftSidenav,
  onLeftSidenavChange,
  rightSidenavStatus: rightSidenav,
  initialRightSidenavStatus,
  onRightSidenavChange,
  name,
  leftSidenavCanBeCompact,
  height = "h-screen",
  className,
  gridClassName = "dashboard-grid",
  blockBodyOverflow = true,
  ...domProps
}) {
  useBlockBodyOverflow(!blockBodyOverflow);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const isCompactModeInitially = useMemo(() => {
    return !name ? false : getFromLocalStorage(`${name}.sidenav.compact`);
  }, [name]);
  const defaultLeftSidenavStatus = isCompactModeInitially ? "compact" : "open";
  const [leftSidenavStatus, setLeftSidenavStatus] = useControlledState(
    leftSidenav,
    isMobile ? "closed" : defaultLeftSidenavStatus,
    onLeftSidenavChange
  );
  const rightSidenavStatusDefault = useMemo(() => {
    if (isMobile) {
      return "closed";
    }
    if (initialRightSidenavStatus != null) {
      return initialRightSidenavStatus;
    }
    const userSelected = getFromLocalStorage(
      `${name}.sidenav.right.position`,
      "open"
    );
    if (userSelected != null) {
      return userSelected;
    }
    return initialRightSidenavStatus || "closed";
  }, [isMobile, name, initialRightSidenavStatus]);
  const [rightSidenavStatus, _setRightSidenavStatus] = useControlledState(
    rightSidenav,
    rightSidenavStatusDefault,
    onRightSidenavChange
  );
  const setRightSidenavStatus = useCallback(
    (status) => {
      _setRightSidenavStatus(status);
      setInLocalStorage(`${name}.sidenav.right.position`, status);
    },
    [_setRightSidenavStatus, name]
  );
  const shouldShowUnderlay = isMobile && (leftSidenavStatus === "open" || rightSidenavStatus === "open");
  return /* @__PURE__ */ jsx(
    DashboardLayoutContext.Provider,
    {
      value: {
        leftSidenavStatus,
        setLeftSidenavStatus,
        rightSidenavStatus,
        setRightSidenavStatus,
        leftSidenavCanBeCompact,
        name,
        isMobileMode: isMobile
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ...domProps,
          className: clsx("relative isolate", gridClassName, className, height),
          children: [
            children,
            /* @__PURE__ */ jsx(AnimatePresence, { children: shouldShowUnderlay && /* @__PURE__ */ jsx(
              Underlay,
              {
                position: "fixed",
                onClick: () => {
                  setLeftSidenavStatus("closed");
                  setRightSidenavStatus("closed");
                }
              },
              "dashboard-underlay"
            ) })
          ]
        }
      )
    }
  );
}
function DashboardContent({
  children,
  isScrollable = true
}) {
  return cloneElement(children, {
    className: clsx(
      children.props.className,
      isScrollable && "overflow-y-auto stable-scrollbar",
      "dashboard-grid-content"
    )
  });
}
function DashboardSidenav({
  className,
  position,
  children,
  size = "md",
  mode,
  overlayPosition = "fixed",
  display = "flex",
  overflow = "overflow-hidden",
  forceClosed = false
}) {
  const {
    isMobileMode,
    leftSidenavStatus,
    setLeftSidenavStatus,
    rightSidenavStatus,
    setRightSidenavStatus
  } = useContext(DashboardLayoutContext);
  const status = position === "left" ? leftSidenavStatus : rightSidenavStatus;
  const isOverlayMode = isMobileMode || mode === "overlay";
  const variants = {
    open: { display, width: null },
    compact: {
      display,
      width: null
    },
    closed: {
      width: 0,
      transitionEnd: {
        display: "none"
      }
    }
  };
  const sizeClassName = getSize(status === "compact" ? "compact" : size);
  return /* @__PURE__ */ jsx(
    m.div,
    {
      variants,
      initial: false,
      animate: forceClosed ? "closed" : status,
      transition: { type: "tween", duration: 0.15 },
      onClick: (e) => {
        const target = e.target;
        if (isMobileMode && (target.closest("button") || target.closest("a"))) {
          setLeftSidenavStatus("closed");
          setRightSidenavStatus("closed");
        }
      },
      className: clsx(
        className,
        position === "left" ? "dashboard-grid-sidenav-left" : "dashboard-grid-sidenav-right",
        "will-change-[width]",
        overflow,
        sizeClassName,
        isOverlayMode && `${overlayPosition} bottom-0 top-0 z-20 shadow-2xl`,
        isOverlayMode && position === "left" && "left-0",
        isOverlayMode && position === "right" && "right-0"
      ),
      children: cloneElement(children, {
        className: clsx(
          children.props.className,
          "w-full h-full",
          status === "compact" && "compact-scrollbar"
        ),
        isCompactMode: status === "compact"
      })
    }
  );
}
function getSize(size) {
  switch (size) {
    case "compact":
      return "w-80";
    case "sm":
      return "w-224";
    case "md":
      return "w-240";
    case "lg":
      return "w-288";
    default:
      return size || "";
  }
}
const MenuOpenIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5L21 15.59z" }),
  "MenuOpenOutlined"
);
function DashboardNavbar({
  children,
  className,
  hideToggleButton,
  ...props
}) {
  const {
    isMobileMode,
    leftSidenavStatus,
    setLeftSidenavStatus,
    name,
    leftSidenavCanBeCompact
  } = useContext(DashboardLayoutContext);
  const shouldToggleCompactMode = leftSidenavCanBeCompact && !isMobileMode;
  const shouldShowToggle = !hideToggleButton && (isMobileMode || leftSidenavCanBeCompact);
  const handleToggle = () => {
    setLeftSidenavStatus(leftSidenavStatus === "open" ? "closed" : "open");
  };
  const handleCompactModeToggle = () => {
    const newStatus = leftSidenavStatus === "compact" ? "open" : "compact";
    setInLocalStorage(`${name}.sidenav.compact`, newStatus === "compact");
    setLeftSidenavStatus(newStatus);
  };
  return /* @__PURE__ */ jsx(
    Navbar,
    {
      className: clsx("dashboard-grid-navbar", className),
      border: "border-b",
      size: "sm",
      toggleButton: shouldShowToggle ? /* @__PURE__ */ jsx(
        IconButton,
        {
          size: "md",
          onClick: () => {
            if (shouldToggleCompactMode) {
              handleCompactModeToggle();
            } else {
              handleToggle();
            }
          },
          children: /* @__PURE__ */ jsx(MenuOpenIcon, {})
        }
      ) : void 0,
      ...props,
      children
    }
  );
}
var FilterControlType = /* @__PURE__ */ ((FilterControlType2) => {
  FilterControlType2["Select"] = "select";
  FilterControlType2["DateRangePicker"] = "dateRangePicker";
  FilterControlType2["SelectModel"] = "selectModel";
  FilterControlType2["Input"] = "input";
  FilterControlType2["BooleanToggle"] = "booleanToggle";
  FilterControlType2["ChipField"] = "chipField";
  FilterControlType2["Custom"] = "custom";
  return FilterControlType2;
})(FilterControlType || {});
var FilterOperator = /* @__PURE__ */ ((FilterOperator2) => {
  FilterOperator2["eq"] = "=";
  FilterOperator2["ne"] = "!=";
  FilterOperator2["gt"] = ">";
  FilterOperator2["gte"] = ">=";
  FilterOperator2["lt"] = "<";
  FilterOperator2["lte"] = "<=";
  FilterOperator2["has"] = "has";
  FilterOperator2["hasAll"] = "hasAll";
  FilterOperator2["doesntHave"] = "doesntHave";
  FilterOperator2["between"] = "between";
  return FilterOperator2;
})(FilterOperator || {});
function startOfDay(date) {
  return date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
}
function endOfDay(date) {
  return date.set({
    hour: 24 - 1,
    minute: 60 - 1,
    second: 60 - 1,
    millisecond: 1e3 - 1
  });
}
function getUserTimezone() {
  var _a2, _b2, _c;
  const defaultTimezone = (_a2 = getBootstrapData()) == null ? void 0 : _a2.settings.dates.default_timezone;
  const preferredTimezone = ((_c = (_b2 = getBootstrapData()) == null ? void 0 : _b2.user) == null ? void 0 : _c.timezone) || defaultTimezone || "auto";
  if (!preferredTimezone || preferredTimezone === "auto") {
    return getLocalTimeZone();
  }
  return preferredTimezone;
}
const Now = startOfDay(now(getUserTimezone()));
const locale = ((_b = (_a = getBootstrapData()) == null ? void 0 : _a.i18n) == null ? void 0 : _b.language) || "en";
const DateRangePresets = [
  {
    key: 0,
    label: message("Today"),
    getRangeValue: () => ({
      preset: 0,
      start: Now,
      end: endOfDay(Now)
    })
  },
  {
    key: 1,
    label: message("Yesterday"),
    getRangeValue: () => ({
      preset: 1,
      start: Now.subtract({ days: 1 }),
      end: endOfDay(Now).subtract({ days: 1 })
    })
  },
  {
    key: 2,
    label: message("This week"),
    getRangeValue: () => ({
      preset: 2,
      start: startOfWeek(Now, locale),
      end: endOfWeek(endOfDay(Now), locale)
    })
  },
  {
    key: 3,
    label: message("Last week"),
    getRangeValue: () => {
      const start = startOfWeek(Now, locale).subtract({ days: 7 });
      return {
        preset: 3,
        start,
        end: start.add({ days: 6 })
      };
    }
  },
  {
    key: 4,
    label: message("Last 7 days"),
    getRangeValue: () => ({
      preset: 4,
      start: Now.subtract({ days: 7 }),
      end: endOfDay(Now)
    })
  },
  {
    key: 6,
    label: message("Last 30 days"),
    getRangeValue: () => ({
      preset: 6,
      start: Now.subtract({ days: 30 }),
      end: endOfDay(Now)
    })
  },
  {
    key: 7,
    label: message("Last 3 months"),
    getRangeValue: () => ({
      preset: 7,
      start: Now.subtract({ months: 3 }),
      end: endOfDay(Now)
    })
  },
  {
    key: 8,
    label: message("Last 12 months"),
    getRangeValue: () => ({
      preset: 8,
      start: Now.subtract({ months: 12 }),
      end: endOfDay(Now)
    })
  },
  {
    key: 9,
    label: message("This month"),
    getRangeValue: () => ({
      preset: 9,
      start: startOfMonth(Now),
      end: endOfMonth(endOfDay(Now))
    })
  },
  {
    key: 10,
    label: message("This year"),
    getRangeValue: () => ({
      preset: 10,
      start: startOfYear(Now),
      end: endOfYear(endOfDay(Now))
    })
  },
  {
    key: 11,
    label: message("Last year"),
    getRangeValue: () => ({
      preset: 11,
      start: startOfYear(Now).subtract({ years: 1 }),
      end: endOfYear(endOfDay(Now)).subtract({ years: 1 })
    })
  }
];
const DateRangeIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M7 11h2v2H7v-2zm14-5v14c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2l.01-14c0-1.1.88-2 1.99-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z" }),
  "DateRangeOutlined"
);
const Input = React.forwardRef(
  (props, ref) => {
    const {
      children,
      inputProps,
      wrapperProps,
      className,
      autoFocus,
      style,
      onClick
    } = props;
    return /* @__PURE__ */ jsx("div", { ...wrapperProps, onClick, children: /* @__PURE__ */ jsx(
      "div",
      {
        ...inputProps,
        role: "group",
        className: clsx(
          className,
          "flex items-center focus-within:ring focus-within:ring-primary/focus focus-within:border-primary/60"
        ),
        ref,
        style,
        children: /* @__PURE__ */ jsx(FocusScope, { autoFocus, children })
      }
    ) });
  }
);
const DatePickerField = React.forwardRef(({ inputRef, wrapperProps, children, onBlur, ...other }, ref) => {
  const fieldClassNames = getInputFieldClassNames(other);
  const objRef = useObjectRef(ref);
  const { fieldProps, inputProps } = useField({
    ...other,
    focusRef: objRef,
    labelElementType: "span"
  });
  fieldClassNames.wrapper = clsx(
    fieldClassNames.wrapper,
    other.disabled && "pointer-events-none"
  );
  return /* @__PURE__ */ jsx(
    Field,
    {
      wrapperProps: mergeProps(
        wrapperProps,
        {
          onBlur: (e) => {
            if (!objRef.current.contains(e.relatedTarget)) {
              onBlur == null ? void 0 : onBlur(e);
            }
          },
          onClick: () => {
            const focusManager = createFocusManager(objRef);
            focusManager == null ? void 0 : focusManager.focusFirst();
          }
        }
      ),
      fieldClassNames,
      ref: objRef,
      ...fieldProps,
      children: /* @__PURE__ */ jsx(
        Input,
        {
          inputProps,
          className: clsx(fieldClassNames.input, "gap-10"),
          ref: inputRef,
          children
        }
      )
    }
  );
});
function getDefaultGranularity(date) {
  if (date instanceof CalendarDate) {
    return "day";
  }
  return "minute";
}
function dateIsInvalid(date, min, max) {
  return min != null && date.compare(min) < 0 || max != null && date.compare(max) > 0;
}
function useBaseDatePickerState(selectedDate, props) {
  const timezone = useUserTimezone();
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const closeDialogOnSelection = props.closeDialogOnSelection ?? true;
  const granularity = props.granularity || getDefaultGranularity(selectedDate);
  const min = props.min ? toZoned(props.min, timezone) : void 0;
  const max = props.max ? toZoned(props.max, timezone) : void 0;
  return {
    timezone,
    granularity,
    min,
    max,
    calendarIsOpen,
    setCalendarIsOpen,
    closeDialogOnSelection
  };
}
function useCurrentDateTime() {
  const timezone = useUserTimezone();
  return useMemo(() => {
    return now(timezone);
  }, [timezone]);
}
function useDateRangePickerState(props) {
  var _a2, _b2;
  const now2 = useCurrentDateTime();
  const [isPlaceholder, setIsPlaceholder] = useState({
    start: (!props.value || !props.value.start) && !((_a2 = props.defaultValue) == null ? void 0 : _a2.start),
    end: (!props.value || !props.value.end) && !((_b2 = props.defaultValue) == null ? void 0 : _b2.end)
  });
  const setStateValue = props.onChange;
  const [internalValue, setInternalValue] = useControlledState(
    props.value ? completeRange(props.value, now2) : void 0,
    !props.value ? completeRange(props.defaultValue, now2) : void 0,
    (value) => {
      setIsPlaceholder({ start: false, end: false });
      setStateValue == null ? void 0 : setStateValue(value);
    }
  );
  const {
    min,
    max,
    granularity,
    timezone,
    calendarIsOpen,
    setCalendarIsOpen,
    closeDialogOnSelection
  } = useBaseDatePickerState(internalValue.start, props);
  const clear = useCallback(() => {
    setIsPlaceholder({ start: true, end: true });
    setInternalValue(completeRange(null, now2));
    setStateValue == null ? void 0 : setStateValue(null);
    setCalendarIsOpen(false);
  }, [now2, setInternalValue, setStateValue, setCalendarIsOpen]);
  const [anchorDate, setAnchorDate] = useState(null);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [highlightedRange, setHighlightedRange] = useState(internalValue);
  const [calendarDates, setCalendarDates] = useState(() => {
    return rangeToCalendarDates(internalValue, max);
  });
  const constrainRange = useCallback(
    (range) => {
      let start = range.start;
      let end = range.end;
      if (min) {
        start = maxDate(start, min);
      }
      const startMax = max ? minDate(max, end) : end;
      start = minDate(start, startMax);
      const endMin = min ? maxDate(min, start) : start;
      end = maxDate(end, endMin);
      if (max) {
        end = minDate(end, max);
      }
      return { start: toZoned(start, timezone), end: toZoned(end, timezone) };
    },
    [min, max, timezone]
  );
  const setSelectedValue = useCallback(
    (newRange) => {
      const value = {
        ...constrainRange(newRange),
        preset: newRange.preset
      };
      setInternalValue(value);
      setHighlightedRange(value);
      setCalendarDates(rangeToCalendarDates(value, max));
      setIsPlaceholder({ start: false, end: false });
    },
    [setInternalValue, constrainRange, max]
  );
  const dayIsActive = useCallback(
    (day) => {
      return !isPlaceholder.start && isSameDay(day, highlightedRange.start) || !isPlaceholder.end && isSameDay(day, highlightedRange.end);
    },
    [highlightedRange, isPlaceholder]
  );
  const dayIsHighlighted = useCallback(
    (day) => {
      return (isHighlighting || !isPlaceholder.start && !isPlaceholder.end) && day.compare(highlightedRange.start) >= 0 && day.compare(highlightedRange.end) <= 0;
    },
    [highlightedRange, isPlaceholder, isHighlighting]
  );
  const dayIsRangeStart = useCallback(
    (day) => isSameDay(day, highlightedRange.start),
    [highlightedRange]
  );
  const dayIsRangeEnd = useCallback(
    (day) => isSameDay(day, highlightedRange.end),
    [highlightedRange]
  );
  const getCellProps = useCallback(
    (date, isSameMonth2) => {
      return {
        onPointerEnter: () => {
          if (isHighlighting && isSameMonth2) {
            setHighlightedRange(
              makeRange({ start: anchorDate, end: date, timezone })
            );
          }
        },
        onClick: () => {
          if (!isHighlighting) {
            setIsHighlighting(true);
            setAnchorDate(date);
            setHighlightedRange(makeRange({ start: date, end: date, timezone }));
          } else {
            const finalRange = makeRange({
              start: anchorDate,
              end: date,
              timezone
            });
            finalRange.start = startOfDay(finalRange.start);
            finalRange.end = endOfDay(finalRange.end);
            setIsHighlighting(false);
            setAnchorDate(null);
            setSelectedValue == null ? void 0 : setSelectedValue(finalRange);
            if (closeDialogOnSelection) {
              setCalendarIsOpen == null ? void 0 : setCalendarIsOpen(false);
            }
          }
        }
      };
    },
    [
      anchorDate,
      isHighlighting,
      setSelectedValue,
      setCalendarIsOpen,
      closeDialogOnSelection,
      timezone
    ]
  );
  return {
    selectedValue: internalValue,
    setSelectedValue,
    calendarIsOpen,
    setCalendarIsOpen,
    dayIsActive,
    dayIsHighlighted,
    dayIsRangeStart,
    dayIsRangeEnd,
    getCellProps,
    calendarDates,
    setIsPlaceholder,
    isPlaceholder,
    clear,
    setCalendarDates,
    min,
    max,
    granularity,
    timezone,
    closeDialogOnSelection
  };
}
function rangeToCalendarDates(range, max) {
  let start = toCalendarDate(startOfMonth(range.start));
  let end = toCalendarDate(endOfMonth(range.end));
  if (isSameMonth(start, end)) {
    end = endOfMonth(end.add({ months: 1 }));
  }
  if (max && end.compare(max) > 0) {
    end = start;
    start = startOfMonth(start.subtract({ months: 1 }));
  }
  return [start, end];
}
function makeRange(props) {
  const start = toZoned(props.start, props.timezone);
  const end = toZoned(props.end, props.timezone);
  if (start.compare(end) > 0) {
    return { start: end, end: start };
  }
  return { start, end };
}
function completeRange(range, now2) {
  if ((range == null ? void 0 : range.start) && (range == null ? void 0 : range.end)) {
    return range;
  } else if (!(range == null ? void 0 : range.start) && (range == null ? void 0 : range.end)) {
    range.start = range.end.subtract({ months: 1 });
    return range;
  } else if (!(range == null ? void 0 : range.end) && (range == null ? void 0 : range.start)) {
    range.end = range.start.add({ months: 1 });
    return range;
  }
  return { start: now2, end: now2.add({ months: 1 }) };
}
const ArrowRightAltIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" }),
  "ArrowRightAltOutlined"
);
function adjustSegment(value, part, amount, options) {
  switch (part) {
    case "era":
    case "year":
    case "month":
    case "day":
      return value.cycle(part, amount, { round: part === "year" });
  }
  if ("hour" in value) {
    switch (part) {
      case "dayPeriod": {
        const hours = value.hour;
        const isPM = hours >= 12;
        return value.set({ hour: isPM ? hours - 12 : hours + 12 });
      }
      case "hour":
      case "minute":
      case "second":
        return value.cycle(part, amount, {
          round: part !== "hour",
          hourCycle: options.hour12 ? 12 : 24
        });
    }
  }
  return value;
}
function setSegment(value, part, segmentValue, options) {
  switch (part) {
    case "day":
    case "month":
    case "year":
      return value.set({ [part]: segmentValue });
  }
  if ("hour" in value) {
    switch (part) {
      case "dayPeriod": {
        const hours = value.hour;
        const wasPM = hours >= 12;
        const isPM = segmentValue >= 12;
        if (isPM === wasPM) {
          return value;
        }
        return value.set({ hour: wasPM ? hours - 12 : hours + 12 });
      }
      case "hour":
        if (options.hour12) {
          const hours = value.hour;
          const wasPM = hours >= 12;
          if (!wasPM && segmentValue === 12) {
            segmentValue = 0;
          }
          if (wasPM && segmentValue < 12) {
            segmentValue += 12;
          }
        }
      case "minute":
      case "second":
        return value.set({ [part]: segmentValue });
    }
  }
  return value;
}
const PAGE_STEP = {
  year: 5,
  month: 2,
  day: 7,
  hour: 2,
  minute: 15,
  second: 15,
  dayPeriod: 1
};
function EditableDateSegment({
  segment,
  domProps,
  value,
  onChange,
  isPlaceholder,
  state: { timezone, calendarIsOpen, setCalendarIsOpen }
}) {
  const isMobile = useIsMobileMediaQuery();
  const enteredKeys = useRef("");
  const { localeCode } = useSelectedLocale();
  const focusManager = useFocusManager();
  const formatter = useDateFormatter({ timeZone: timezone });
  const parser = useMemo(
    () => new NumberParser(localeCode, { maximumFractionDigits: 0 }),
    [localeCode]
  );
  const setSegmentValue = (newValue) => {
    onChange(
      setSegment(value, segment.type, newValue, formatter.resolvedOptions())
    );
  };
  const adjustSegmentValue = (amount) => {
    onChange(
      adjustSegment(value, segment.type, amount, formatter.resolvedOptions())
    );
  };
  const backspace = () => {
    if (parser.isValidPartialNumber(segment.text)) {
      const newValue = segment.text.slice(0, -1);
      const parsed = parser.parse(newValue);
      if (newValue.length === 0 || parsed === 0) {
        const now2 = today(timezone);
        if (segment.type in now2) {
          setSegmentValue(now2[segment.type]);
        }
      } else {
        setSegmentValue(parsed);
      }
      enteredKeys.current = newValue;
    } else if (segment.type === "dayPeriod") {
      adjustSegmentValue(-1);
    }
  };
  const onKeyDown = (e) => {
    var _a2;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return;
    }
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        e.stopPropagation();
        focusManager == null ? void 0 : focusManager.focusPrevious();
        break;
      case "ArrowRight":
        e.preventDefault();
        e.stopPropagation();
        focusManager == null ? void 0 : focusManager.focusNext();
        break;
      case "Enter":
        (_a2 = e.target.closest("form")) == null ? void 0 : _a2.requestSubmit();
        setCalendarIsOpen(!calendarIsOpen);
        break;
      case "Tab":
        break;
      case "Backspace":
      case "Delete": {
        e.preventDefault();
        e.stopPropagation();
        backspace();
        break;
      }
      case "ArrowUp":
        e.preventDefault();
        enteredKeys.current = "";
        adjustSegmentValue(1);
        break;
      case "ArrowDown":
        e.preventDefault();
        enteredKeys.current = "";
        adjustSegmentValue(-1);
        break;
      case "PageUp":
        e.preventDefault();
        enteredKeys.current = "";
        adjustSegmentValue(PAGE_STEP[segment.type] || 1);
        break;
      case "PageDown":
        e.preventDefault();
        enteredKeys.current = "";
        adjustSegmentValue(-(PAGE_STEP[segment.type] || 1));
        break;
      case "Home":
        e.preventDefault();
        enteredKeys.current = "";
        setSegmentValue(segment.maxValue);
        break;
      case "End":
        e.preventDefault();
        enteredKeys.current = "";
        setSegmentValue(segment.minValue);
        break;
    }
    onInput(e.key);
  };
  const amPmFormatter = useDateFormatter({ hour: "numeric", hour12: true });
  const am = useMemo(() => {
    const amDate = /* @__PURE__ */ new Date();
    amDate.setHours(0);
    return amPmFormatter.formatToParts(amDate).find((part) => part.type === "dayPeriod").value;
  }, [amPmFormatter]);
  const pm = useMemo(() => {
    const pmDate = /* @__PURE__ */ new Date();
    pmDate.setHours(12);
    return amPmFormatter.formatToParts(pmDate).find((part) => part.type === "dayPeriod").value;
  }, [amPmFormatter]);
  const onInput = (key) => {
    const newValue = enteredKeys.current + key;
    switch (segment.type) {
      case "dayPeriod":
        if (am.toLowerCase().startsWith(key)) {
          setSegmentValue(0);
        } else if (pm.toLowerCase().startsWith(key)) {
          setSegmentValue(12);
        } else {
          break;
        }
        focusManager == null ? void 0 : focusManager.focusNext();
        break;
      case "day":
      case "hour":
      case "minute":
      case "second":
      case "month":
      case "year": {
        if (!parser.isValidPartialNumber(newValue)) {
          return;
        }
        let numberValue = parser.parse(newValue);
        let segmentValue = numberValue;
        let allowsZero = segment.minValue === 0;
        if (segment.type === "hour" && formatter.resolvedOptions().hour12) {
          switch (formatter.resolvedOptions().hourCycle) {
            case "h11":
              if (numberValue > 11) {
                segmentValue = parser.parse(key);
              }
              break;
            case "h12":
              allowsZero = false;
              if (numberValue > 12) {
                segmentValue = parser.parse(key);
              }
              break;
          }
          if (segment.value >= 12 && numberValue > 1) {
            numberValue += 12;
          }
        } else if (numberValue > segment.maxValue) {
          segmentValue = parser.parse(key);
        }
        if (Number.isNaN(numberValue)) {
          return;
        }
        const shouldSetValue = segmentValue !== 0 || allowsZero;
        if (shouldSetValue) {
          setSegmentValue(segmentValue);
        }
        if (Number(`${numberValue}0`) > segment.maxValue || newValue.length >= String(segment.maxValue).length) {
          enteredKeys.current = "";
          if (shouldSetValue) {
            focusManager == null ? void 0 : focusManager.focusNext();
          }
        } else {
          enteredKeys.current = newValue;
        }
        break;
      }
    }
  };
  const spinButtonProps = isMobile ? {} : {
    "aria-label": segment.type,
    "aria-valuetext": isPlaceholder ? void 0 : `${segment.value}`,
    "aria-valuemin": segment.minValue,
    "aria-valuemax": segment.maxValue,
    "aria-valuenow": isPlaceholder ? void 0 : segment.value,
    tabIndex: 0,
    onKeyDown
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...mergeProps(domProps, {
        ...spinButtonProps,
        onFocus: (e) => {
          enteredKeys.current = "";
          e.target.scrollIntoView({ block: "nearest" });
        },
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
        }
      }),
      className: "box-content cursor-default select-none whitespace-nowrap rounded p-2 text-center tabular-nums caret-transparent outline-none focus:bg-primary focus:text-on-primary",
      children: segment.text.padStart(segment.minLength, "0")
    }
  );
}
function LiteralDateSegment({ segment, domProps }) {
  const focusManager = useFocusManager();
  return /* @__PURE__ */ jsx(
    "div",
    {
      ...domProps,
      onPointerDown: (e) => {
        if (e.pointerType === "mouse") {
          e.preventDefault();
          const res = focusManager == null ? void 0 : focusManager.focusNext({ from: e.target });
          if (!res) {
            focusManager == null ? void 0 : focusManager.focusPrevious({ from: e.target });
          }
        }
      },
      "aria-hidden": true,
      className: "min-w-4 cursor-default select-none",
      children: segment.text
    }
  );
}
function getSegmentLimits(date, type, options) {
  switch (type) {
    case "year":
      return {
        value: date.year,
        placeholder: "yyyy",
        minValue: 1,
        maxValue: date.calendar.getYearsInEra(date)
      };
    case "month":
      return {
        value: date.month,
        placeholder: "mm",
        minValue: getMinimumMonthInYear(date),
        maxValue: date.calendar.getMonthsInYear(date)
      };
    case "day":
      return {
        value: date.day,
        minValue: getMinimumDayInMonth(date),
        maxValue: date.calendar.getDaysInMonth(date),
        placeholder: "dd"
      };
  }
  if ("hour" in date) {
    switch (type) {
      case "dayPeriod":
        return {
          value: date.hour >= 12 ? 12 : 0,
          minValue: 0,
          maxValue: 12,
          placeholder: "--"
        };
      case "hour":
        if (options.hour12) {
          const isPM = date.hour >= 12;
          return {
            value: date.hour,
            minValue: isPM ? 12 : 0,
            maxValue: isPM ? 23 : 11,
            placeholder: "--"
          };
        }
        return {
          value: date.hour,
          minValue: 0,
          maxValue: 23,
          placeholder: "--"
        };
      case "minute":
        return {
          value: date.minute,
          minValue: 0,
          maxValue: 59,
          placeholder: "--"
        };
    }
  }
  return {};
}
function DateSegmentList({
  segmentProps,
  state,
  value,
  onChange,
  isPlaceholder
}) {
  const { granularity } = state;
  const options = useMemo(() => {
    const memoOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric"
    };
    if (granularity === "minute") {
      memoOptions.hour = "numeric";
      memoOptions.minute = "numeric";
    }
    return memoOptions;
  }, [granularity]);
  const formatter = useDateFormatter(options);
  const dateValue = useMemo(() => value.toDate(), [value]);
  const segments = useMemo(() => {
    return formatter.formatToParts(dateValue).map((segment) => {
      const limits = getSegmentLimits(
        value,
        segment.type,
        formatter.resolvedOptions()
      );
      const textValue = isPlaceholder && segment.type !== "literal" ? limits.placeholder : segment.value;
      return {
        type: segment.type,
        text: segment.value === ", " ? " " : textValue,
        ...limits,
        minLength: segment.type !== "literal" ? String(limits.maxValue).length : 1
      };
    });
  }, [dateValue, formatter, isPlaceholder, value]);
  return /* @__PURE__ */ jsx("div", { className: "flex items-center", children: segments.map((segment, index) => {
    if (segment.type === "literal") {
      return /* @__PURE__ */ jsx(
        LiteralDateSegment,
        {
          domProps: segmentProps,
          segment
        },
        index
      );
    }
    return /* @__PURE__ */ jsx(
      EditableDateSegment,
      {
        isPlaceholder,
        domProps: segmentProps,
        state,
        value,
        onChange,
        segment
      },
      index
    );
  }) });
}
const KeyboardArrowRightIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" }),
  "KeyboardArrowRightOutlined"
);
function CalendarCell({
  date,
  currentMonth,
  state: {
    dayIsActive,
    dayIsHighlighted,
    dayIsRangeStart,
    dayIsRangeEnd,
    getCellProps,
    timezone,
    min,
    max
  }
}) {
  const { localeCode } = useSelectedLocale();
  const dayOfWeek = getDayOfWeek(date, localeCode);
  const isActive = dayIsActive(date);
  const isHighlighted = dayIsHighlighted(date);
  const isRangeStart = dayIsRangeStart(date);
  const isRangeEnd = dayIsRangeEnd(date);
  const dayIsToday = isToday(date, timezone);
  const sameMonth = isSameMonth(date, currentMonth);
  const isDisabled = dateIsInvalid(date, min, max);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "button",
      "aria-disabled": isDisabled,
      className: clsx(
        "w-40 h-40 text-sm relative isolate flex-shrink-0",
        isDisabled && "text-disabled pointer-events-none",
        !sameMonth && "invisible pointer-events-none"
      ),
      ...getCellProps(date, sameMonth),
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: clsx(
              "absolute inset-0 flex items-center justify-center rounded-full w-full h-full select-none z-10 cursor-pointer",
              !isActive && !dayIsToday && "hover:bg-hover",
              isActive && "bg-primary text-on-primary font-semibold",
              dayIsToday && !isActive && "bg-chip"
            ),
            children: date.day
          }
        ),
        isHighlighted && sameMonth && /* @__PURE__ */ jsx(
          "span",
          {
            className: clsx(
              "absolute w-full h-full inset-0 bg-primary/focus",
              (isRangeStart || dayOfWeek === 0 || date.day === 1) && "rounded-l-full",
              (isRangeEnd || dayOfWeek === 6 || date.day === currentMonth.calendar.getDaysInMonth(currentMonth)) && "rounded-r-full"
            )
          }
        )
      ]
    }
  );
}
function CalendarMonth({
  startDate,
  state,
  isFirst,
  isLast
}) {
  const { localeCode } = useSelectedLocale();
  const weeksInMonth = getWeeksInMonth(startDate, localeCode);
  const monthStart = startOfWeek(startDate, localeCode);
  return /* @__PURE__ */ jsxs("div", { className: "w-280 flex-shrink-0", children: [
    /* @__PURE__ */ jsx(
      CalendarMonthHeader,
      {
        isFirst,
        isLast,
        state,
        currentMonth: startDate
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "block", role: "grid", children: [
      /* @__PURE__ */ jsx(WeekdayHeader, { state, startDate }),
      [...new Array(weeksInMonth).keys()].map((weekIndex) => /* @__PURE__ */ jsx(m.div, { className: "flex mb-6", children: [...new Array(7).keys()].map((dayIndex) => /* @__PURE__ */ jsx(
        CalendarCell,
        {
          date: monthStart.add({ weeks: weekIndex, days: dayIndex }),
          currentMonth: startDate,
          state
        },
        dayIndex
      )) }, weekIndex))
    ] })
  ] });
}
function CalendarMonthHeader({
  currentMonth,
  isFirst,
  isLast,
  state: { calendarDates, setCalendarDates, timezone, min, max }
}) {
  const shiftCalendars = (direction) => {
    const count = calendarDates.length;
    let newDates;
    if (direction === "forward") {
      newDates = calendarDates.map(
        (date) => endOfMonth(date.add({ months: count }))
      );
    } else {
      newDates = calendarDates.map(
        (date) => endOfMonth(date.subtract({ months: count }))
      );
    }
    setCalendarDates(newDates);
  };
  const monthFormatter = useDateFormatter({
    month: "long",
    year: "numeric",
    era: currentMonth.calendar.identifier !== "gregory" ? "long" : void 0,
    calendar: currentMonth.calendar.identifier
  });
  const isBackwardDisabled = dateIsInvalid(
    currentMonth.subtract({ days: 1 }),
    min,
    max
  );
  const isForwardDisabled = dateIsInvalid(
    startOfMonth(currentMonth.add({ months: 1 })),
    min,
    max
  );
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-10", children: [
    /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "md",
        className: clsx("text-muted", !isFirst && "invisible"),
        disabled: !isFirst || isBackwardDisabled,
        "aria-hidden": !isFirst,
        onClick: () => {
          shiftCalendars("backward");
        },
        children: /* @__PURE__ */ jsx(KeyboardArrowLeftIcon, {})
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold select-none", children: monthFormatter.format(currentMonth.toDate(timezone)) }),
    /* @__PURE__ */ jsx(
      IconButton,
      {
        size: "md",
        className: clsx("text-muted", !isLast && "invisible"),
        disabled: !isLast || isForwardDisabled,
        "aria-hidden": !isLast,
        onClick: () => {
          shiftCalendars("forward");
        },
        children: /* @__PURE__ */ jsx(KeyboardArrowRightIcon, {})
      }
    )
  ] });
}
function WeekdayHeader({ state: { timezone }, startDate }) {
  const { localeCode } = useSelectedLocale();
  const dayFormatter = useDateFormatter({ weekday: "short" });
  const monthStart = startOfWeek(startDate, localeCode);
  return /* @__PURE__ */ jsx("div", { className: "flex", children: [...new Array(7).keys()].map((index) => {
    const date = monthStart.add({ days: index });
    const dateDay = date.toDate(timezone);
    const weekday = dayFormatter.format(dateDay);
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "w-40 h-40 text-sm font-semibold relative flex-shrink-0",
        children: /* @__PURE__ */ jsx("div", { className: "absolute flex items-center justify-center w-full h-full select-none", children: weekday })
      },
      index
    );
  }) });
}
function Calendar({ state, visibleMonths = 1 }) {
  const isMobile = useIsMobileMediaQuery();
  if (isMobile) {
    visibleMonths = 1;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: [...new Array(visibleMonths).keys()].map((index) => {
    const startDate = toCalendarDate(
      startOfMonth(state.calendarDates[index])
    );
    const isFirst = index === 0;
    const isLast = index === visibleMonths - 1;
    return /* @__PURE__ */ jsx(
      CalendarMonth,
      {
        state,
        startDate,
        isFirst,
        isLast
      },
      index
    );
  }) });
}
const FormattedDateTimeRange = memo(
  ({ start, end, options, preset }) => {
    const { dates } = useSettings();
    const timezone = useUserTimezone();
    const formatter = useDateFormatter(
      options || DateFormatPresets[preset || (dates == null ? void 0 : dates.format)]
    );
    if (!start || !end) {
      return null;
    }
    let value;
    try {
      value = formatter.formatRange(
        castToDate(start, timezone),
        castToDate(end, timezone)
      );
    } catch (e) {
      value = "";
    }
    return /* @__PURE__ */ jsx(Fragment, { children: value });
  },
  shallowEqual
);
function castToDate(date, timezone) {
  if (typeof date === "string") {
    return parseAbsolute(date, timezone).toDate();
  }
  if ("toDate" in date) {
    return date.toDate(timezone);
  }
  return date;
}
function DatePresetList({
  onPresetSelected,
  selectedValue
}) {
  return /* @__PURE__ */ jsx(List, { children: DateRangePresets.map((preset) => /* @__PURE__ */ jsx(
    ListItem,
    {
      borderRadius: "rounded-none",
      capitalizeFirst: true,
      isSelected: (selectedValue == null ? void 0 : selectedValue.preset) === preset.key,
      onSelected: () => {
        const newValue = preset.getRangeValue();
        onPresetSelected(newValue);
      },
      children: /* @__PURE__ */ jsx(Trans, { ...preset.label })
    },
    preset.key
  )) });
}
function useIsTabletMediaQuery(options) {
  return useMediaQuery("(max-width: 1024px)", options);
}
const Switch = React.forwardRef(
  (props, ref) => {
    const {
      children,
      size = "sm",
      description,
      className,
      invalid,
      autoFocus,
      errorMessage,
      iconRight,
      ...domProps
    } = props;
    const inputRef = useObjectRef(ref);
    useAutoFocus({ autoFocus }, inputRef);
    const style = getSizeClassName$1(size);
    const fieldClassNames = getInputFieldClassNames(props);
    const descriptionId = useId();
    return /* @__PURE__ */ jsxs("div", { className: clsx(className, "isolate"), children: [
      /* @__PURE__ */ jsxs("label", { className: "flex select-none items-center", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            ...domProps,
            type: "checkbox",
            role: "switch",
            "aria-invalid": invalid || void 0,
            "aria-describedby": description ? descriptionId : void 0,
            ref: inputRef,
            "aria-checked": domProps.checked,
            className: clsx(
              style,
              !invalid && "checked:border-primary checked:bg-primary dark:checked:border-primary-dark dark:checked:bg-primary-dark",
              invalid && "checked:border-danger checked:bg-danger",
              "relative flex flex-shrink-0 cursor-pointer appearance-none items-center overflow-hidden rounded-3xl border border-chip bg-chip p-0 outline-none transition-colors checked:border-primary checked:bg-primary",
              "before:z-10 before:block before:translate-x-2 before:rounded-3xl before:border before:bg-white before:transition-transform",
              "checked:before:border-white",
              "focus-visible:ring",
              props.disabled && "cursor-not-allowed opacity-80"
            )
          }
        ),
        children && /* @__PURE__ */ jsx(
          "span",
          {
            className: clsx(
              fieldClassNames.size.font,
              "ml-12",
              invalid && "text-danger",
              props.disabled && "text-disabled"
            ),
            children
          }
        ),
        iconRight
      ] }),
      description && !errorMessage && /* @__PURE__ */ jsx("div", { id: descriptionId, className: fieldClassNames.description, children: description }),
      errorMessage && /* @__PURE__ */ jsx("div", { id: descriptionId, className: fieldClassNames.error, children: errorMessage })
    ] });
  }
);
function FormSwitch(props) {
  const {
    field: { onChange, onBlur, value = false, ref },
    fieldState: { invalid, error }
  } = useController({
    name: props.name
  });
  const formProps = {
    onChange: (e) => {
      if (e.target.value && e.target.value !== "on") {
        onChange(e.target.checked ? e.target.value : false);
      } else {
        onChange(e);
      }
    },
    onBlur,
    checked: !!value,
    invalid,
    errorMessage: error == null ? void 0 : error.message,
    name: props.name
  };
  return /* @__PURE__ */ jsx(Switch, { ref, ...mergeProps(props, formProps) });
}
function getSizeClassName$1(size) {
  switch (size) {
    case "xl":
      return "w-68 h-36 before:w-28 before:h-28 checked:before:translate-x-36";
    case "lg":
      return "w-56 h-30 before:w-22 before:h-22 checked:before:translate-x-30";
    case "md":
      return "w-46 h-24 before:w-18 before:h-18 checked:before:translate-x-24";
    case "xs":
      return "w-30 h-18 before:w-12 before:h-12 checked:before:translate-x-14";
    default:
      return "w-38 h-20 before:w-14 before:h-14 checked:before:translate-x-20";
  }
}
const DateRangeComparePresets = [
  {
    key: 0,
    label: message("Preceding period"),
    getRangeValue: (range) => {
      const startDate = range.start;
      const endDate = range.end;
      const diffInMilliseconds = endDate.toDate().getTime() - startDate.toDate().getTime();
      const diffInMinutes = diffInMilliseconds / (1e3 * 60);
      const newStart = startDate.subtract({ minutes: diffInMinutes });
      return {
        preset: 0,
        start: newStart,
        end: startDate
      };
    }
  },
  {
    key: 1,
    label: message("Same period last year"),
    getRangeValue: (range) => {
      return {
        start: range.start.subtract({ years: 1 }),
        end: range.end.subtract({ years: 1 }),
        preset: 1
      };
    }
  },
  {
    key: 2,
    label: message("Custom"),
    getRangeValue: (range) => {
      return {
        start: range.start.subtract({ weeks: 1 }),
        end: range.end.subtract({ weeks: 1 }),
        preset: 2
      };
    }
  }
];
function DateRangeComparePresetList({
  originalRangeValue,
  onPresetSelected,
  selectedValue
}) {
  return /* @__PURE__ */ jsx(List, { children: DateRangeComparePresets.map((preset) => /* @__PURE__ */ jsx(
    ListItem,
    {
      borderRadius: "rounded-none",
      capitalizeFirst: true,
      isSelected: (selectedValue == null ? void 0 : selectedValue.preset) === preset.key,
      onSelected: () => {
        const newValue = preset.getRangeValue(originalRangeValue);
        onPresetSelected(newValue);
      },
      children: /* @__PURE__ */ jsx(Trans, { ...preset.label })
    },
    preset.key
  )) });
}
function DateRangeDialog({
  state,
  compareState,
  showInlineDatePickerField = false,
  compareVisibleDefault = false
}) {
  const isTablet = useIsTabletMediaQuery();
  const { close } = useDialogContext();
  const initialStateRef = useRef(state);
  const hasPlaceholder = state.isPlaceholder.start || state.isPlaceholder.end;
  const [compareVisible, setCompareVisible] = useState(compareVisibleDefault);
  const footer = /* @__PURE__ */ jsxs(
    DialogFooter,
    {
      dividerTop: true,
      startAction: !hasPlaceholder && !isTablet ? /* @__PURE__ */ jsx("div", { className: "text-xs", children: /* @__PURE__ */ jsx(
        FormattedDateTimeRange,
        {
          start: state.selectedValue.start.toDate(),
          end: state.selectedValue.end.toDate(),
          options: { dateStyle: "medium" }
        }
      ) }) : void 0,
      children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "text",
            size: "xs",
            onClick: () => {
              state.setSelectedValue(initialStateRef.current.selectedValue);
              state.setIsPlaceholder(initialStateRef.current.isPlaceholder);
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
            size: "xs",
            onClick: () => {
              const value = state.selectedValue;
              if (compareState && compareVisible) {
                value.compareStart = compareState.selectedValue.start;
                value.compareEnd = compareState.selectedValue.end;
              }
              close(value);
            },
            children: /* @__PURE__ */ jsx(Trans, { message: "Select" })
          }
        )
      ]
    }
  );
  return /* @__PURE__ */ jsxs(Dialog, { size: "auto", children: [
    /* @__PURE__ */ jsxs(DialogBody, { className: "flex", padding: "p-0", children: [
      !isTablet && /* @__PURE__ */ jsxs("div", { className: "min-w-192 py-14", children: [
        /* @__PURE__ */ jsx(
          DatePresetList,
          {
            selectedValue: state.selectedValue,
            onPresetSelected: (preset) => {
              state.setSelectedValue(preset);
              if (state.closeDialogOnSelection) {
                close(preset);
              }
            }
          }
        ),
        !!compareState && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            Switch,
            {
              className: "mx-20 mb-10 mt-14",
              checked: compareVisible,
              onChange: (e) => setCompareVisible(e.target.checked),
              children: /* @__PURE__ */ jsx(Trans, { message: "Compare" })
            }
          ),
          compareVisible && /* @__PURE__ */ jsx(
            DateRangeComparePresetList,
            {
              originalRangeValue: state.selectedValue,
              selectedValue: compareState.selectedValue,
              onPresetSelected: (preset) => {
                compareState.setSelectedValue(preset);
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: /* @__PURE__ */ jsx(
        Calendars,
        {
          state,
          compareState,
          showInlineDatePickerField,
          compareVisible
        }
      ) })
    ] }),
    !state.closeDialogOnSelection && footer
  ] });
}
function Calendars({
  state,
  compareState,
  showInlineDatePickerField,
  compareVisible
}) {
  return /* @__PURE__ */ jsxs(
    m.div,
    {
      initial: { width: 0, overflow: "hidden" },
      animate: { width: "auto" },
      exit: { width: 0, overflow: "hidden" },
      transition: { type: "tween", duration: 0.125 },
      className: "border-l px-20 pb-20 pt-10",
      children: [
        showInlineDatePickerField && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(InlineDatePickerField, { state }),
          !!compareState && compareVisible && /* @__PURE__ */ jsx(
            InlineDatePickerField,
            {
              state: compareState,
              label: /* @__PURE__ */ jsx(Trans, { message: "Compare" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-start gap-36", children: /* @__PURE__ */ jsx(Calendar, { state, visibleMonths: 2 }) })
      ]
    }
  );
}
function InlineDatePickerField({ state, label }) {
  const { selectedValue, setSelectedValue } = state;
  return /* @__PURE__ */ jsxs(DatePickerField, { className: "mb-20 mt-10", label, children: [
    /* @__PURE__ */ jsx(
      DateSegmentList,
      {
        state,
        value: selectedValue.start,
        onChange: (newValue) => {
          setSelectedValue({ ...selectedValue, start: newValue });
        }
      }
    ),
    /* @__PURE__ */ jsx(ArrowRightAltIcon, { className: "block flex-shrink-0 text-muted", size: "md" }),
    /* @__PURE__ */ jsx(
      DateSegmentList,
      {
        state,
        value: selectedValue.end,
        onChange: (newValue) => {
          setSelectedValue({ ...selectedValue, end: newValue });
        }
      }
    )
  ] });
}
function DateRangePicker(props) {
  var _a2, _b2;
  const { granularity, closeDialogOnSelection, ...fieldProps } = props;
  const state = useDateRangePickerState(props);
  const inputRef = useRef(null);
  const isMobile = useIsMobileMediaQuery();
  const hideCalendarIcon = isMobile && granularity !== "day";
  const dialog = /* @__PURE__ */ jsx(
    DialogTrigger,
    {
      offset: 8,
      placement: "bottom-start",
      isOpen: state.calendarIsOpen,
      onOpenChange: state.setCalendarIsOpen,
      type: "popover",
      triggerRef: inputRef,
      returnFocusToTrigger: false,
      moveFocusToDialog: false,
      children: /* @__PURE__ */ jsx(DateRangeDialog, { state })
    }
  );
  const openOnClick = {
    onClick: (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!isHourSegment$1(e)) {
        state.setCalendarIsOpen(true);
      } else {
        state.setCalendarIsOpen(false);
      }
    }
  };
  const value = state.selectedValue;
  const onChange = state.setSelectedValue;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      DatePickerField,
      {
        ref: inputRef,
        wrapperProps: openOnClick,
        endAdornment: !hideCalendarIcon ? /* @__PURE__ */ jsx(DateRangeIcon, {}) : void 0,
        ...fieldProps,
        children: [
          /* @__PURE__ */ jsx(
            DateSegmentList,
            {
              isPlaceholder: (_a2 = state.isPlaceholder) == null ? void 0 : _a2.start,
              state,
              segmentProps: openOnClick,
              value: value.start,
              onChange: (newValue) => {
                onChange({ start: newValue, end: value.end });
              }
            }
          ),
          /* @__PURE__ */ jsx(
            ArrowRightAltIcon,
            {
              className: "block flex-shrink-0 text-muted",
              size: "md"
            }
          ),
          /* @__PURE__ */ jsx(
            DateSegmentList,
            {
              isPlaceholder: (_b2 = state.isPlaceholder) == null ? void 0 : _b2.end,
              state,
              segmentProps: openOnClick,
              value: value.end,
              onChange: (newValue) => {
                onChange({ start: value.start, end: newValue });
              }
            }
          )
        ]
      }
    ),
    dialog
  ] });
}
function isHourSegment$1(e) {
  return ["hour", "minute", "dayPeriod"].includes(
    e.currentTarget.ariaLabel || ""
  );
}
function FormDateRangePicker(props) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, error }
  } = useController({
    name: props.name
  });
  const formProps = {
    onChange: (e) => {
      onChange(e ? dateRangeToAbsoluteRange(e) : null);
    },
    onBlur,
    value: absoluteRangeToDateRange(value),
    invalid,
    errorMessage: error == null ? void 0 : error.message,
    inputRef: ref
  };
  return /* @__PURE__ */ jsx(DateRangePicker, { ...mergeProps(formProps, props) });
}
function absoluteRangeToDateRange(props) {
  const { start, end, preset } = props || {};
  const dateRange = { preset };
  try {
    if (start) {
      dateRange.start = typeof start === "string" ? parseAbsoluteToLocal(start) : start;
    }
    if (end) {
      dateRange.end = typeof end === "string" ? parseAbsoluteToLocal(end) : end;
    }
  } catch (e) {
  }
  return dateRange;
}
function dateRangeToAbsoluteRange({
  start,
  end,
  preset
} = {}) {
  const absoluteRange = {
    preset
  };
  if (start) {
    absoluteRange.start = start.toAbsoluteString();
  }
  if (end) {
    absoluteRange.end = end.toAbsoluteString();
  }
  return absoluteRange;
}
function timestampFilter(options) {
  var _a2;
  return {
    ...options,
    defaultOperator: FilterOperator.between,
    control: {
      type: FilterControlType.DateRangePicker,
      defaultValue: ((_a2 = options.control) == null ? void 0 : _a2.defaultValue) || dateRangeToAbsoluteRange(
        DateRangePresets[3].getRangeValue()
      )
    }
  };
}
function createdAtFilter(options) {
  return timestampFilter({
    key: "created_at",
    label: message("Date created"),
    ...options
  });
}
function updatedAtFilter(options) {
  return timestampFilter({
    key: "updated_at",
    label: message("Last updated"),
    ...options
  });
}
const BackendFiltersUrlKey = "filters";
function decodeBackendFilters(encodedFilters) {
  if (!encodedFilters)
    return [];
  let filtersFromQuery = [];
  try {
    filtersFromQuery = JSON.parse(atob(decodeURIComponent(encodedFilters)));
    filtersFromQuery.map((filterValue) => {
      if (filterValue.valueKey != null) {
        filterValue.value = filterValue.valueKey;
      }
      return filterValue;
    });
  } catch (e) {
  }
  return filtersFromQuery;
}
function encodeBackendFilters(filterValues, filters) {
  if (!filterValues)
    return "";
  filterValues = !filters ? filterValues : filterValues.filter((item) => item.value !== "").map((item) => transformValue(item, filters));
  filterValues = filterValues.filter((fm) => !fm.isInactive);
  if (!filterValues.length) {
    return "";
  }
  return encodeURIComponent(btoa(JSON.stringify(filterValues)));
}
function transformValue(filterValue, filters) {
  var _a2;
  const filterConfig = filters.find((f) => f.key === filterValue.key);
  if ((filterConfig == null ? void 0 : filterConfig.control.type) === "select") {
    const option = (filterConfig.control.options || []).find(
      (o) => o.key === filterValue.value
    );
    if (option) {
      return { ...filterValue, value: option.value, valueKey: option.key };
    }
  }
  if ((_a2 = filterConfig == null ? void 0 : filterConfig.extraFilters) == null ? void 0 : _a2.length) {
    filterValue["extraFilters"] = filterConfig.extraFilters;
  }
  return filterValue;
}
function useBackendFilterUrlParams(filters, pinnedFilters) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const encodedFilters = searchParams.get(BackendFiltersUrlKey);
  const decodedFilters = useMemo(() => {
    if (!filters)
      return [];
    const decoded = decodeBackendFilters(encodedFilters);
    (pinnedFilters || []).forEach((key) => {
      if (!decoded.find((f) => f.key === key)) {
        const config = filters.find((f) => f.key === key);
        decoded.push({
          key,
          value: config.control.defaultValue,
          operator: config.defaultOperator,
          isInactive: true
        });
      }
    });
    decoded.sort(
      (a, b) => filters.findIndex((f) => f.key === a.key) - filters.findIndex((f) => f.key === b.key)
    );
    return decoded;
  }, [encodedFilters, pinnedFilters, filters]);
  const getDecodedWithoutKeys = useCallback(
    (values) => {
      const newFilters = [...decodedFilters];
      values.forEach((value) => {
        const key = typeof value === "object" ? value.key : value;
        const index = newFilters.findIndex((f) => f.key === key);
        if (index > -1) {
          newFilters.splice(index, 1);
        }
      });
      return newFilters;
    },
    [decodedFilters]
  );
  const replaceAll = useCallback(
    (filterValues) => {
      const encodedFilters2 = encodeBackendFilters(filterValues, filters);
      if (encodedFilters2) {
        searchParams.set(BackendFiltersUrlKey, encodedFilters2);
      } else {
        searchParams.delete(BackendFiltersUrlKey);
      }
      navigate({ search: `?${searchParams}` }, { replace: true });
    },
    [filters, navigate, searchParams]
  );
  const add = useCallback(
    (filterValues) => {
      const existing = getDecodedWithoutKeys(filterValues);
      const decodedFilters2 = [...existing, ...filterValues];
      replaceAll(decodedFilters2);
    },
    [getDecodedWithoutKeys, replaceAll]
  );
  const remove = useCallback(
    (key) => replaceAll(getDecodedWithoutKeys([key])),
    [getDecodedWithoutKeys, replaceAll]
  );
  return {
    add,
    remove,
    replaceAll,
    decodedFilters,
    encodedFilters
  };
}
function isCtrlKeyPressed(e) {
  if (isMac()) {
    return e.metaKey;
  }
  return e.ctrlKey;
}
function useGridNavigation(props) {
  const { cellCount, rowCount } = props;
  const onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        focusSiblingCell(e, { cell: { op: "decrement" } }, props);
        break;
      case "ArrowRight":
        focusSiblingCell(e, { cell: { op: "increment" } }, props);
        break;
      case "ArrowUp":
        focusSiblingCell(e, { row: { op: "decrement" } }, props);
        break;
      case "ArrowDown":
        focusSiblingCell(e, { row: { op: "increment" } }, props);
        break;
      case "PageUp":
        focusSiblingCell(e, { row: { op: "decrement", count: 5 } }, props);
        break;
      case "PageDown":
        focusSiblingCell(e, { row: { op: "increment", count: 5 } }, props);
        break;
      case "Tab":
        focusFirstElementAfterGrid(e);
        break;
      case "Home":
        if (isCtrlKeyPressed(e)) {
          focusSiblingCell(
            e,
            {
              row: { op: "decrement", count: rowCount },
              cell: { op: "decrement", count: cellCount }
            },
            props
          );
        } else {
          focusSiblingCell(
            e,
            { cell: { op: "decrement", count: cellCount } },
            props
          );
        }
        break;
      case "End":
        if (isCtrlKeyPressed(e)) {
          focusSiblingCell(
            e,
            {
              row: { op: "increment", count: rowCount },
              cell: { op: "increment", count: cellCount }
            },
            props
          );
        } else {
          focusSiblingCell(
            e,
            { cell: { op: "increment", count: cellCount } },
            props
          );
        }
        break;
    }
  };
  return { onKeyDown };
}
function focusSiblingCell(e, operations, { cellCount, rowCount }) {
  var _a2, _b2, _c, _d, _e, _f, _g;
  if (((_a2 = document.activeElement) == null ? void 0 : _a2.tagName) === "input")
    return;
  e.preventDefault();
  const grid = e.currentTarget;
  const currentCell = e.target.closest("[aria-colindex]");
  if (!currentCell || !grid)
    return;
  const row = currentCell.closest("[aria-rowindex]");
  if (!row)
    return;
  let rowIndex = parseInt(row.getAttribute("aria-rowindex"));
  let cellIndex = parseInt(currentCell.getAttribute("aria-colindex"));
  if (Number.isNaN(rowIndex) || Number.isNaN(cellIndex))
    return;
  const rowOpCount = ((_b2 = operations.row) == null ? void 0 : _b2.count) ?? 1;
  if (((_c = operations.row) == null ? void 0 : _c.op) === "increment") {
    rowIndex = Math.min(rowCount, rowIndex + rowOpCount);
  } else if (((_d = operations.row) == null ? void 0 : _d.op) === "decrement") {
    rowIndex = Math.max(1, rowIndex - rowOpCount);
  }
  const cellOpCount = ((_e = operations.cell) == null ? void 0 : _e.count) ?? 1;
  if (((_f = operations.cell) == null ? void 0 : _f.op) === "increment") {
    cellIndex = Math.min(cellCount, cellIndex + cellOpCount);
  } else if (((_g = operations.cell) == null ? void 0 : _g.op) === "decrement") {
    cellIndex = Math.max(1, cellIndex - cellOpCount);
  }
  const nextCell = grid.querySelector(
    `[aria-rowindex="${rowIndex}"] [aria-colindex="${cellIndex}"]`
  );
  if (!nextCell)
    return;
  const walker = getFocusableTreeWalker(nextCell);
  const nextFocusableElement = walker.nextNode() || nextCell;
  currentCell.setAttribute("tabindex", "-1");
  nextFocusableElement.setAttribute("tabindex", "0");
  nextFocusableElement.focus();
}
function focusFirstElementAfterGrid(e) {
  const grid = e.currentTarget;
  if (e.shiftKey) {
    grid.focus();
  } else {
    const walker = getFocusableTreeWalker(grid, { tabbable: true });
    let next;
    let last;
    do {
      last = walker.lastChild();
      if (last) {
        next = last;
      }
    } while (last);
    if (next && !next.contains(document.activeElement)) {
      focusWithoutScrolling(next);
    }
  }
}
const TableContext = createContext(null);
function useTableCellStyle({ index, isHeader }) {
  const {
    columns,
    cellHeight = "h-46",
    headerCellHeight = "h-46"
  } = useContext(TableContext);
  const column = columns[index];
  const userPadding = column == null ? void 0 : column.padding;
  let justify = "justify-start";
  if ((column == null ? void 0 : column.align) === "center") {
    justify = "justify-center";
  } else if ((column == null ? void 0 : column.align) === "end") {
    justify = "justify-end";
  }
  return clsx(
    "flex items-center overflow-hidden whitespace-nowrap overflow-ellipsis outline-none focus-visible:outline focus-visible:outline-offset-2",
    isHeader ? headerCellHeight : cellHeight,
    (column == null ? void 0 : column.width) ?? "flex-1",
    column == null ? void 0 : column.maxWidth,
    column == null ? void 0 : column.minWidth,
    justify,
    userPadding,
    column == null ? void 0 : column.className
  );
}
function TableCell({
  rowIndex,
  rowIsHovered,
  index,
  item,
  id
}) {
  const { columns } = useContext(TableContext);
  const column = columns[index];
  const rowContext = useMemo(() => {
    return {
      index: rowIndex,
      isHovered: rowIsHovered,
      isPlaceholder: item.isPlaceholder
    };
  }, [rowIndex, rowIsHovered, item.isPlaceholder]);
  const style = useTableCellStyle({
    index,
    isHeader: false
  });
  return /* @__PURE__ */ jsx(
    "div",
    {
      tabIndex: -1,
      role: "gridcell",
      "aria-colindex": index + 1,
      id,
      className: style,
      children: /* @__PURE__ */ jsx("div", { className: "overflow-x-hidden overflow-ellipsis min-w-0 w-full", children: column.body(item, rowContext) })
    }
  );
}
function usePointerEvents({
  onMoveStart,
  onMove,
  onMoveEnd,
  minimumMovement = 0,
  preventDefault,
  stopPropagation = true,
  onPress,
  onLongPress,
  ...props
}) {
  const stateRef = useRef({
    lastPosition: { x: 0, y: 0 },
    started: false,
    longPressTriggered: false
  });
  const state = stateRef.current;
  const { addGlobalListener, removeGlobalListener } = useGlobalListeners();
  const start = (e) => {
    if (!state.el)
      return;
    const result = onMoveStart == null ? void 0 : onMoveStart(e, state.el);
    if (result === false)
      return;
    state.originalTouchAction = state.el.style.touchAction;
    state.el.style.touchAction = "none";
    state.originalUserSelect = document.documentElement.style.userSelect;
    document.documentElement.style.userSelect = "none";
    state.started = true;
  };
  const onPointerDown = (e) => {
    var _a2;
    if (e.button === 0 && state.id == null) {
      state.started = false;
      const result = (_a2 = props.onPointerDown) == null ? void 0 : _a2.call(props, e);
      if (result === false)
        return;
      if (stopPropagation) {
        e.stopPropagation();
      }
      if (preventDefault) {
        e.preventDefault();
      }
      state.id = e.pointerId;
      state.el = e.currentTarget;
      state.lastPosition = { x: e.clientX, y: e.clientY };
      if (onLongPress) {
        state.longPressTimer = setTimeout(() => {
          onLongPress(e, state.el);
          state.longPressTriggered = true;
        }, 400);
      }
      if (onMoveStart || onMove) {
        addGlobalListener(window, "pointermove", onPointerMove, false);
      }
      addGlobalListener(window, "pointerup", onPointerUp, false);
      addGlobalListener(window, "pointercancel", onPointerUp, false);
    }
  };
  const onPointerMove = (e) => {
    if (e.pointerId === state.id) {
      const deltaX = e.clientX - state.lastPosition.x;
      const deltaY = e.clientY - state.lastPosition.y;
      if ((Math.abs(deltaX) >= minimumMovement || Math.abs(deltaY) >= minimumMovement) && !state.started) {
        start(e);
      }
      if (state.started) {
        onMove == null ? void 0 : onMove(e, deltaX, deltaY);
        state.lastPosition = { x: e.clientX, y: e.clientY };
      }
    }
  };
  const onPointerUp = (e) => {
    var _a2;
    if (e.pointerId === state.id) {
      if (state.longPressTimer) {
        clearTimeout(state.longPressTimer);
      }
      const longPressTriggered = state.longPressTriggered;
      state.longPressTriggered = false;
      if (state.started) {
        onMoveEnd == null ? void 0 : onMoveEnd(e);
      }
      if (state.el) {
        if (e.type !== "pointercancel") {
          (_a2 = props.onPointerUp) == null ? void 0 : _a2.call(props, e, state.el);
          if (e.target && state.el.contains(e.target)) {
            if (longPressTriggered) {
              onLongPress == null ? void 0 : onLongPress(e, state.el);
            } else {
              onPress == null ? void 0 : onPress(e, state.el);
            }
          }
        }
        document.documentElement.style.userSelect = state.originalUserSelect || "";
        state.el.style.touchAction = state.originalTouchAction || "";
      }
      state.id = void 0;
      state.started = false;
      removeGlobalListener(window, "pointermove", onPointerMove, false);
      removeGlobalListener(window, "pointerup", onPointerUp, false);
      removeGlobalListener(window, "pointercancel", onPointerUp, false);
    }
  };
  return {
    domProps: {
      onPointerDown: createEventHandler(onPointerDown)
    }
  };
}
function isCtrlOrShiftPressed(e) {
  return e.shiftKey || isCtrlKeyPressed(e);
}
function useTableRowStyle({ index, isSelected, isHeader }) {
  const isDarkMode = useIsDarkMode();
  const isMobile = useIsMobileMediaQuery();
  const { hideBorder, enableSelection, collapseOnMobile, onAction } = useContext(TableContext);
  const isFirst = index === 0;
  return clsx(
    "flex gap-x-16 break-inside-avoid outline-none border border-transparent",
    onAction && "cursor-pointer",
    isMobile && collapseOnMobile && hideBorder ? "mb-8 pl-8 pr-0 rounded" : "px-16",
    !hideBorder && "border-b-divider",
    !hideBorder && isFirst && "border-t-divider",
    isSelected && !isDarkMode && "bg-primary/selected hover:bg-primary/focus focus-visible:bg-primary/focus",
    isSelected && isDarkMode && "bg-selected hover:bg-focus focus-visible:bg-focus",
    !isSelected && !isHeader && (enableSelection || onAction) && "focus-visible:bg-focus hover:bg-hover"
  );
}
const interactableElements = ["button", "a", "input", "select", "textarea"];
function TableRow({
  item,
  index,
  renderAs,
  className,
  style
}) {
  const {
    selectedRows,
    columns,
    toggleRow,
    selectRow,
    onAction,
    selectRowOnContextMenu,
    enableSelection,
    selectionStyle,
    hideHeaderRow
  } = useContext(TableContext);
  const isTouchDevice = useRef(false);
  const isSelected = selectedRows.includes(item.id);
  const [isHovered, setIsHovered] = useState(false);
  const clickedOnInteractable = (e) => {
    return e.target.closest(interactableElements.join(","));
  };
  const doubleClickHandler = (e) => {
    if (selectionStyle === "highlight" && onAction && !isTouchDevice.current && !clickedOnInteractable(e)) {
      e.preventDefault();
      e.stopPropagation();
      onAction(item, index);
    }
  };
  const anyRowsSelected = !!selectedRows.length;
  const handleRowTap = (e) => {
    if (clickedOnInteractable(e))
      return;
    if (selectionStyle === "checkbox") {
      if (enableSelection && (anyRowsSelected || !onAction)) {
        toggleRow(item);
      } else if (onAction) {
        onAction(item, index);
      }
    } else if (selectionStyle === "highlight") {
      if (isTouchDevice.current) {
        if (enableSelection && anyRowsSelected) {
          toggleRow(item);
        } else {
          onAction == null ? void 0 : onAction(item, index);
        }
      } else if (enableSelection) {
        selectRow(item, isCtrlOrShiftPressed(e));
      }
    }
  };
  const { domProps } = usePointerEvents({
    onPointerDown: (e) => {
      isTouchDevice.current = e.pointerType === "touch";
    },
    onPress: handleRowTap,
    onLongPress: enableSelection ? () => {
      if (isTouchDevice.current) {
        toggleRow(item);
      }
    } : void 0
  });
  const keyboardHandler = (e) => {
    if (enableSelection && e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (selectionStyle === "checkbox") {
        toggleRow(item);
      } else {
        selectRow(item);
      }
    } else if (e.key === "Enter" && !selectedRows.length && onAction) {
      e.preventDefault();
      e.stopPropagation();
      onAction(item, index);
    }
  };
  const contextMenuHandler = (e) => {
    if (selectRowOnContextMenu && enableSelection) {
      if (!selectedRows.includes(item.id)) {
        selectRow(item);
      }
    }
    if (isTouchDevice.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const styleClassName = useTableRowStyle({ index, isSelected });
  const RowElement = renderAs || "div";
  return /* @__PURE__ */ jsx(
    RowElement,
    {
      role: "row",
      "aria-rowindex": index + 1 + (hideHeaderRow ? 0 : 1),
      "aria-selected": isSelected,
      tabIndex: -1,
      className: clsx(className, styleClassName),
      item: RowElement === "div" ? void 0 : item,
      onDoubleClick: createEventHandler(doubleClickHandler),
      onKeyDown: createEventHandler(keyboardHandler),
      onContextMenu: createEventHandler(contextMenuHandler),
      onPointerEnter: createEventHandler(() => setIsHovered(true)),
      onPointerLeave: createEventHandler(() => setIsHovered(false)),
      style,
      ...domProps,
      children: columns.map((column, cellIndex) => /* @__PURE__ */ jsx(
        TableCell,
        {
          rowIndex: index,
          rowIsHovered: isHovered,
          index: cellIndex,
          item
        },
        `${item.id}-${column.key}`
      ))
    }
  );
}
const CheckboxColumnConfig = {
  key: "checkbox",
  header: () => /* @__PURE__ */ jsx(SelectAllCheckbox, {}),
  align: "center",
  width: "w-24 flex-shrink-0",
  body: (item, row) => {
    if (row.isPlaceholder) {
      return /* @__PURE__ */ jsx(Skeleton, { size: "w-24 h-24", variant: "rect" });
    }
    return /* @__PURE__ */ jsx(SelectRowCheckbox, { item });
  }
};
function SelectRowCheckbox({ item }) {
  const { selectedRows, toggleRow } = useContext(TableContext);
  return /* @__PURE__ */ jsx(
    Checkbox,
    {
      checked: selectedRows.includes(item.id),
      onChange: () => toggleRow(item)
    }
  );
}
function SelectAllCheckbox() {
  const { trans } = useTrans();
  const { data, selectedRows, onSelectionChange } = useContext(TableContext);
  const allRowsSelected = !!data.length && data.length === selectedRows.length;
  const someRowsSelected = !allRowsSelected && !!selectedRows.length;
  return /* @__PURE__ */ jsx(
    Checkbox,
    {
      "aria-label": trans({ message: "Select all" }),
      isIndeterminate: someRowsSelected,
      checked: allRowsSelected,
      onChange: () => {
        if (allRowsSelected) {
          onSelectionChange([]);
        } else {
          onSelectionChange(data.map((d) => d.id));
        }
      }
    }
  );
}
const ArrowDownwardIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "m20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" }),
  "ArrowDownwardOutlined"
);
function HeaderCell({ index }) {
  const { columns, sortDescriptor, onSortChange, enableSorting } = useContext(TableContext);
  const column = columns[index];
  const style = useTableCellStyle({
    index,
    isHeader: true
  });
  const [isHovered, setIsHovered] = useState(false);
  const sortingKey = column.sortingKey || column.key;
  const allowSorting = column.allowsSorting && enableSorting;
  const { orderBy, orderDir } = sortDescriptor || {};
  const sortActive = allowSorting && orderBy === sortingKey;
  let ariaSort;
  if (sortActive && orderDir === "asc") {
    ariaSort = "ascending";
  } else if (sortActive && orderDir === "desc") {
    ariaSort = "descending";
  } else if (allowSorting) {
    ariaSort = "none";
  }
  const toggleSorting = () => {
    if (!allowSorting)
      return;
    let newSort;
    if (sortActive && orderDir === "desc") {
      newSort = { orderDir: "asc", orderBy: sortingKey };
    } else if (sortActive && orderDir === "asc") {
      newSort = { orderBy: void 0, orderDir: void 0 };
    } else {
      newSort = { orderDir: "desc", orderBy: sortingKey };
    }
    onSortChange == null ? void 0 : onSortChange(newSort);
  };
  const sortVisible = sortActive || isHovered;
  const sortVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: "-25%" }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "columnheader",
      tabIndex: -1,
      "aria-colindex": index + 1,
      "aria-sort": ariaSort,
      className: clsx(
        style,
        "text-muted font-medium text-xs",
        allowSorting && "cursor-pointer"
      ),
      onMouseEnter: () => {
        setIsHovered(true);
      },
      onMouseLeave: () => {
        setIsHovered(false);
      },
      onKeyDown: (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggleSorting();
        }
      },
      onClick: toggleSorting,
      children: [
        column.hideHeader ? /* @__PURE__ */ jsx("div", { className: "sr-only", children: column.header() }) : column.header(),
        /* @__PURE__ */ jsx(AnimatePresence, { children: allowSorting && /* @__PURE__ */ jsx(
          m.span,
          {
            variants: sortVariants,
            animate: sortVisible ? "visible" : "hidden",
            initial: false,
            transition: { type: "tween" },
            className: "inline-block ml-6 -mt-2",
            "data-testid": "table-sort-button",
            "aria-hidden": !sortVisible,
            children: /* @__PURE__ */ jsx(
              ArrowDownwardIcon,
              {
                size: "xs",
                className: clsx(
                  "text-muted",
                  orderDir === "asc" && orderBy === sortingKey && "rotate-180 transition-transform"
                )
              }
            )
          },
          "sort-icon"
        ) })
      ]
    }
  );
}
function TableHeaderRow() {
  const { columns } = useContext(TableContext);
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "row",
      "aria-rowindex": 1,
      tabIndex: -1,
      className: "flex gap-x-16 px-16",
      children: columns.map((column, columnIndex) => /* @__PURE__ */ jsx(HeaderCell, { index: columnIndex }, column.key))
    }
  );
}
function Table({
  className,
  columns: userColumns,
  collapseOnMobile = true,
  hideHeaderRow = false,
  hideBorder = false,
  data,
  selectedRows: propsSelectedRows,
  defaultSelectedRows: propsDefaultSelectedRows,
  onSelectionChange: propsOnSelectionChange,
  sortDescriptor: propsSortDescriptor,
  onSortChange: propsOnSortChange,
  enableSorting = true,
  onDelete,
  enableSelection = true,
  selectionStyle = "checkbox",
  ariaLabelledBy,
  selectRowOnContextMenu,
  onAction,
  renderRowAs,
  tableBody,
  meta,
  tableRef: propsTableRef,
  closeOnInteractOutside = false,
  cellHeight,
  headerCellHeight,
  ...domProps
}) {
  const isMobile = useIsMobileMediaQuery();
  const isCollapsedMode = !!isMobile && collapseOnMobile;
  if (isCollapsedMode) {
    hideHeaderRow = true;
    hideBorder = true;
  }
  const [selectedRows, onSelectionChange] = useControlledState(
    propsSelectedRows,
    propsDefaultSelectedRows || [],
    propsOnSelectionChange
  );
  const [sortDescriptor, onSortChange] = useControlledState(
    propsSortDescriptor,
    void 0,
    propsOnSortChange
  );
  const toggleRow = useCallback(
    (item) => {
      const newValues = [...selectedRows];
      if (!newValues.includes(item.id)) {
        newValues.push(item.id);
      } else {
        const index = newValues.indexOf(item.id);
        newValues.splice(index, 1);
      }
      onSelectionChange(newValues);
    },
    [selectedRows, onSelectionChange]
  );
  const selectRow = useCallback(
    // allow deselecting all rows by passing in null
    (item, merge) => {
      let newValues = [];
      if (item) {
        newValues = merge ? [...selectedRows == null ? void 0 : selectedRows.filter((id) => id !== item.id), item.id] : [item.id];
      }
      onSelectionChange(newValues);
    },
    [selectedRows, onSelectionChange]
  );
  const columns = useMemo(() => {
    const filteredColumns = userColumns.filter((c) => {
      const visibleInMode = c.visibleInMode || "regular";
      if (visibleInMode === "all") {
        return true;
      }
      if (visibleInMode === "compact" && isCollapsedMode) {
        return true;
      }
      if (visibleInMode === "regular" && !isCollapsedMode) {
        return true;
      }
    });
    const showCheckboxCell = enableSelection && selectionStyle !== "highlight" && !isMobile;
    if (showCheckboxCell) {
      filteredColumns.unshift(CheckboxColumnConfig);
    }
    return filteredColumns;
  }, [isMobile, userColumns, enableSelection, selectionStyle, isCollapsedMode]);
  const contextValue = {
    isCollapsedMode,
    cellHeight,
    headerCellHeight,
    hideBorder,
    hideHeaderRow,
    selectedRows,
    onSelectionChange,
    enableSorting,
    enableSelection,
    selectionStyle,
    data,
    columns,
    sortDescriptor,
    onSortChange,
    toggleRow,
    selectRow,
    onAction,
    selectRowOnContextMenu,
    meta,
    collapseOnMobile
  };
  const navProps = useGridNavigation({
    cellCount: enableSelection ? columns.length + 1 : columns.length,
    rowCount: data.length + 1
  });
  const tableBodyProps = {
    renderRowAs
  };
  if (!tableBody) {
    tableBody = /* @__PURE__ */ jsx(BasicTableBody, { ...tableBodyProps });
  } else {
    tableBody = cloneElement(tableBody, tableBodyProps);
  }
  const tableRef = useObjectRef(propsTableRef);
  useInteractOutside({
    ref: tableRef,
    onInteractOutside: (e) => {
      if (closeOnInteractOutside && enableSelection && (selectedRows == null ? void 0 : selectedRows.length) && // don't deselect if clicking on a dialog (for example is table row has a context menu)
      !e.target.closest('[role="dialog"]')) {
        onSelectionChange([]);
      }
    }
  });
  return /* @__PURE__ */ jsx(TableContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxs(
    "div",
    {
      ...mergeProps(domProps, navProps, {
        onKeyDown: (e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            if (selectedRows == null ? void 0 : selectedRows.length) {
              onSelectionChange([]);
            }
          } else if (e.key === "Delete") {
            e.preventDefault();
            e.stopPropagation();
            if (selectedRows == null ? void 0 : selectedRows.length) {
              onDelete == null ? void 0 : onDelete(
                data.filter((item) => selectedRows == null ? void 0 : selectedRows.includes(item.id))
              );
            }
          } else if (isCtrlKeyPressed(e) && e.key === "a") {
            e.preventDefault();
            e.stopPropagation();
            if (enableSelection) {
              onSelectionChange(data.map((item) => item.id));
            }
          }
        }
      }),
      role: "grid",
      tabIndex: 0,
      "aria-rowcount": data.length + 1,
      "aria-colcount": columns.length + 1,
      ref: tableRef,
      "aria-multiselectable": enableSelection ? true : void 0,
      "aria-labelledby": ariaLabelledBy,
      className: clsx(
        className,
        "isolate select-none text-sm outline-none focus-visible:ring-2"
      ),
      children: [
        !hideHeaderRow && /* @__PURE__ */ jsx(TableHeaderRow, {}),
        tableBody
      ]
    }
  ) });
}
function BasicTableBody({ renderRowAs }) {
  const { data } = useContext(TableContext);
  return /* @__PURE__ */ jsx(Fragment, { children: data.map((item, rowIndex) => /* @__PURE__ */ jsx(
    TableRow,
    {
      item,
      index: rowIndex,
      renderAs: renderRowAs
    },
    item.id
  )) });
}
function SelectFilterPanel({
  filter
}) {
  const { trans } = useTrans();
  return /* @__PURE__ */ jsx(
    FormSelect,
    {
      size: "sm",
      name: `${filter.key}.value`,
      selectionMode: "single",
      showSearchField: filter.control.showSearchField,
      placeholder: filter.control.placeholder ? trans(filter.control.placeholder) : void 0,
      searchPlaceholder: filter.control.searchPlaceholder ? trans(filter.control.searchPlaceholder) : void 0,
      children: filter.control.options.map((option) => /* @__PURE__ */ jsx(Item, { value: option.key, children: /* @__PURE__ */ jsx(Trans, { ...option.label }) }, option.key))
    }
  );
}
function DateRangeFilterPanel({
  filter
}) {
  return /* @__PURE__ */ jsx(
    FormDateRangePicker,
    {
      min: filter.control.min,
      max: filter.control.max,
      size: "sm",
      name: `${filter.key}.value`,
      granularity: "day",
      closeDialogOnSelection: true
    }
  );
}
const Avatar = forwardRef(
  ({
    className,
    circle,
    size = "md",
    src,
    link,
    label,
    fallback = "generic",
    lazy = true,
    ...domProps
  }, ref) => {
    let renderedAvatar = src ? /* @__PURE__ */ jsx(
      "img",
      {
        ref,
        src,
        alt: label,
        loading: lazy ? "lazy" : void 0,
        className: "block h-full w-full object-cover"
      }
    ) : /* @__PURE__ */ jsx("div", { className: "h-full w-full bg-alt dark:bg-chip", children: /* @__PURE__ */ jsx(
      AvatarPlaceholderIcon,
      {
        viewBox: "0 0 48 48",
        className: "h-full w-full text-muted"
      }
    ) });
    if (label) {
      renderedAvatar = /* @__PURE__ */ jsx(Tooltip, { label, children: renderedAvatar });
    }
    const wrapperProps = {
      ...domProps,
      className: clsx(
        className,
        "relative block overflow-hidden select-none flex-shrink-0",
        getSizeClassName(size),
        circle ? "rounded-full" : "rounded"
      )
    };
    return link ? /* @__PURE__ */ jsx(Link, { ...wrapperProps, to: link, children: renderedAvatar }) : /* @__PURE__ */ jsx("div", { ...wrapperProps, children: renderedAvatar });
  }
);
function getSizeClassName(size) {
  switch (size) {
    case "xs":
      return "w-18 h-18";
    case "sm":
      return "w-24 h-24";
    case "md":
      return "w-32 h-32";
    case "lg":
      return "w-40 h-40";
    case "xl":
      return "w-60 h-60";
    default:
      return size;
  }
}
function useNormalizedModels(endpoint, queryParams, queryOptions) {
  return useQuery({
    queryKey: [endpoint, queryParams],
    queryFn: () => fetchModels(endpoint, queryParams),
    placeholderData: keepPreviousData,
    ...queryOptions
  });
}
async function fetchModels(endpoint, params) {
  return apiClient.get(endpoint, { params }).then((r) => r.data);
}
function useNormalizedModel(endpoint, queryParams, queryOptions) {
  return useQuery({
    queryKey: [endpoint, queryParams],
    queryFn: () => fetchModel(endpoint, queryParams),
    ...queryOptions
  });
}
async function fetchModel(endpoint, params) {
  return apiClient.get(endpoint, { params }).then((r) => r.data);
}
function NormalizedModelField({
  label,
  className,
  background,
  value,
  defaultValue = "",
  placeholder = message("Select item..."),
  searchPlaceholder = message("Find an item..."),
  onChange,
  description,
  errorMessage,
  invalid,
  autoFocus,
  queryParams,
  endpoint,
  disabled,
  required
}) {
  var _a2;
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useControlledState(
    value,
    defaultValue,
    onChange
  );
  const query = useNormalizedModels(endpoint, {
    query: inputValue,
    ...queryParams
  });
  const { trans } = useTrans();
  const fieldClassNames = getInputFieldClassNames({ size: "md" });
  if (selectedValue) {
    return /* @__PURE__ */ jsxs("div", { className, children: [
      /* @__PURE__ */ jsx("div", { className: fieldClassNames.label, children: label }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: clsx(
            "rounded-input border p-8",
            background,
            invalid && "border-danger"
          ),
          children: /* @__PURE__ */ jsx(AnimatePresence, { initial: false, mode: "wait", children: /* @__PURE__ */ jsx(
            SelectedModelPreview,
            {
              disabled,
              endpoint,
              modelId: selectedValue,
              queryParams,
              onEditClick: () => {
                setSelectedValue("");
                setInputValue("");
                requestAnimationFrame(() => {
                  var _a3, _b2;
                  (_a3 = inputRef.current) == null ? void 0 : _a3.focus();
                  (_b2 = inputRef.current) == null ? void 0 : _b2.click();
                });
              }
            }
          ) })
        }
      ),
      description && !errorMessage && /* @__PURE__ */ jsx("div", { className: fieldClassNames.description, children: description }),
      errorMessage && /* @__PURE__ */ jsx("div", { className: fieldClassNames.error, children: errorMessage })
    ] });
  }
  return /* @__PURE__ */ jsx(
    SelectForwardRef,
    {
      className,
      showSearchField: true,
      invalid,
      errorMessage,
      description,
      color: "white",
      isAsync: true,
      background,
      placeholder: trans(placeholder),
      searchPlaceholder: trans(searchPlaceholder),
      label,
      isLoading: query.isFetching,
      items: (_a2 = query.data) == null ? void 0 : _a2.results,
      inputValue,
      onInputValueChange: setInputValue,
      selectionMode: "single",
      selectedValue,
      onSelectionChange: setSelectedValue,
      ref: inputRef,
      autoFocus,
      disabled,
      required,
      children: (model) => /* @__PURE__ */ jsx(
        Item,
        {
          value: model.id,
          description: model.description,
          startIcon: /* @__PURE__ */ jsx(Avatar, { src: model.image }),
          children: model.name
        },
        model.id
      )
    }
  );
}
function SelectedModelPreview({
  modelId,
  onEditClick,
  endpoint,
  disabled,
  queryParams
}) {
  const { data, isLoading } = useNormalizedModel(
    `${endpoint}/${modelId}`,
    queryParams
  );
  if (isLoading || !(data == null ? void 0 : data.model)) {
    return /* @__PURE__ */ jsx(LoadingSkeleton, {}, "skeleton");
  }
  return /* @__PURE__ */ jsxs(
    m.div,
    {
      className: clsx(
        "flex items-center gap-10",
        disabled && "pointer-events-none cursor-not-allowed text-disabled"
      ),
      ...opacityAnimation,
      children: [
        data.model.image && /* @__PURE__ */ jsx(Avatar, { src: data.model.image }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm leading-4", children: data.model.name }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted", children: data.model.description })
        ] }),
        /* @__PURE__ */ jsx(Tooltip, { label: /* @__PURE__ */ jsx(Trans, { message: "Change item" }), children: /* @__PURE__ */ jsx(
          IconButton,
          {
            className: "ml-auto text-muted",
            size: "sm",
            onClick: onEditClick,
            disabled,
            children: /* @__PURE__ */ jsx(EditIcon, {})
          }
        ) })
      ]
    },
    "preview"
  );
}
function LoadingSkeleton() {
  return /* @__PURE__ */ jsxs(m.div, { className: "flex items-center gap-10", ...opacityAnimation, children: [
    /* @__PURE__ */ jsx(Skeleton, { variant: "rect", size: "w-32 h-32" }),
    /* @__PURE__ */ jsxs("div", { className: "max-h-[36px] flex-auto", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "text-xs" }),
      /* @__PURE__ */ jsx(Skeleton, { className: "max-h-8 text-xs" })
    ] }),
    /* @__PURE__ */ jsx(Skeleton, { variant: "icon", size: "w-24 h-24" })
  ] });
}
function FormNormalizedModelField({
  name,
  ...fieldProps
}) {
  const { clearErrors } = useFormContext();
  const {
    field: { onChange, value = "" },
    fieldState: { invalid, error }
  } = useController({
    name
  });
  return /* @__PURE__ */ jsx(
    NormalizedModelField,
    {
      value,
      onChange: (value2) => {
        onChange(value2);
        clearErrors(name);
      },
      invalid,
      errorMessage: error == null ? void 0 : error.message,
      ...fieldProps
    }
  );
}
function NormalizedModelFilterPanel({
  filter
}) {
  return /* @__PURE__ */ jsx(
    FormNormalizedModelField,
    {
      name: `${filter.key}.value`,
      endpoint: `normalized-models/${filter.control.model}`
    }
  );
}
const FilterOperatorNames = {
  "=": message("is"),
  "!=": message("is not"),
  ">": message("is greater than"),
  ">=": message("is greater than or equal to"),
  "<": message("is less than"),
  "<=": message("is less than or equal to"),
  has: message("Include"),
  doesntHave: message("Do not include"),
  between: message("Is between"),
  hasAll: message("Include all")
};
function InputFilterPanel({
  filter
}) {
  var _a2;
  const control = filter.control;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      FormSelect,
      {
        selectionMode: "single",
        name: `${filter.key}.operator`,
        className: "mb-14",
        size: "sm",
        required: true,
        children: (_a2 = filter.operators) == null ? void 0 : _a2.map((operator) => /* @__PURE__ */ jsx(Item, { value: operator, children: /* @__PURE__ */ jsx(Trans, { ...FilterOperatorNames[operator] }) }, operator))
      }
    ),
    /* @__PURE__ */ jsx(
      FormTextField,
      {
        size: "sm",
        name: `${filter.key}.value`,
        type: filter.control.inputType,
        min: "minValue" in control ? control.minValue : void 0,
        max: "maxValue" in control ? control.maxValue : void 0,
        minLength: "minLength" in control ? control.minLength : void 0,
        maxLength: "maxLength" in control ? control.maxLength : void 0,
        required: true
      }
    )
  ] });
}
function ChipList({
  className,
  children,
  size,
  color,
  radius,
  selectable,
  wrap = true
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: clsx(
        "flex items-center gap-8",
        wrap && "flex-wrap",
        className
      ),
      children: Children.map(children, (chip) => {
        if (isValidElement(chip)) {
          return cloneElement(chip, {
            size,
            color,
            selectable,
            radius
          });
        }
      })
    }
  );
}
function stringToChipValue(value) {
  return { id: value, name: `${value}`, description: `${value}` };
}
function ChipFieldInner(props, ref) {
  const fieldRef = useRef(null);
  const inputRef = useObjectRef(ref);
  const {
    displayWith = (v) => v.name,
    validateWith,
    children,
    suggestions,
    isLoading,
    inputValue,
    onInputValueChange,
    onItemSelected,
    placeholder,
    onOpenChange,
    chipSize = "sm",
    openMenuOnFocus = true,
    showEmptyMessage,
    value: propsValue,
    defaultValue,
    onChange: propsOnChange,
    valueKey,
    isAsync,
    allowCustomValue = true,
    showDropdownArrow,
    onChipClick,
    ...inputFieldProps
  } = props;
  const fieldClassNames = getInputFieldClassNames({
    ...props,
    flexibleHeight: true
  });
  const [value, onChange] = useChipFieldValueState(props);
  const [listboxIsOpen, setListboxIsOpen] = useState(false);
  const loadingIndicator = /* @__PURE__ */ jsx(ProgressCircle, { isIndeterminate: true, size: "sm", "aria-label": "loading..." });
  const dropdownArrow = showDropdownArrow ? /* @__PURE__ */ jsx(KeyboardArrowDownIcon, {}) : null;
  const { fieldProps, inputProps } = useField({
    ...inputFieldProps,
    focusRef: inputRef,
    endAdornment: isLoading && listboxIsOpen ? loadingIndicator : dropdownArrow
  });
  return /* @__PURE__ */ jsx(Field, { fieldClassNames, ...fieldProps, children: /* @__PURE__ */ jsxs(
    Input,
    {
      ref: fieldRef,
      className: clsx("flex flex-wrap items-center", fieldClassNames.input),
      onClick: () => {
        var _a2;
        (_a2 = inputRef.current) == null ? void 0 : _a2.focus();
      },
      children: [
        /* @__PURE__ */ jsx(
          ListWrapper,
          {
            displayChipUsing: displayWith,
            onChipClick,
            items: value,
            setItems: onChange,
            chipSize
          }
        ),
        /* @__PURE__ */ jsx(
          ChipInput,
          {
            size: props.size,
            showEmptyMessage,
            inputProps,
            inputValue,
            onInputValueChange,
            fieldRef,
            inputRef,
            chips: value,
            setChips: onChange,
            validateWith,
            isLoading,
            suggestions,
            placeholder,
            openMenuOnFocus,
            listboxIsOpen,
            setListboxIsOpen,
            allowCustomValue,
            children
          }
        )
      ]
    }
  ) });
}
function ListWrapper({
  items,
  setItems,
  displayChipUsing,
  chipSize,
  onChipClick
}) {
  const manager = useFocusManager();
  const removeItem = useCallback(
    (key) => {
      const i = items.findIndex((cr) => cr.id === key);
      const newItems = [...items];
      if (i > -1) {
        newItems.splice(i, 1);
        setItems(newItems);
      }
      return newItems;
    },
    [items, setItems]
  );
  return /* @__PURE__ */ jsx(
    ChipList,
    {
      className: clsx(
        "max-w-full flex-shrink-0 flex-wrap",
        chipSize === "xs" ? "my-6" : "my-8"
      ),
      size: chipSize,
      selectable: true,
      children: items.map((item) => /* @__PURE__ */ jsx(
        Chip,
        {
          errorMessage: item.errorMessage,
          adornment: item.image ? /* @__PURE__ */ jsx(Avatar, { circle: true, src: item.image }) : null,
          onClick: () => onChipClick == null ? void 0 : onChipClick(item),
          onRemove: () => {
            const newItems = removeItem(item.id);
            if (newItems.length) {
              manager == null ? void 0 : manager.focusPrevious({ tabbable: true });
            } else {
              manager == null ? void 0 : manager.focusLast();
            }
          },
          children: displayChipUsing(item)
        },
        item.id
      ))
    }
  );
}
function ChipInput(props) {
  const {
    inputRef,
    fieldRef,
    validateWith,
    setChips,
    chips,
    suggestions,
    inputProps,
    placeholder,
    openMenuOnFocus,
    listboxIsOpen,
    setListboxIsOpen,
    allowCustomValue,
    isLoading,
    size
  } = props;
  const manager = useFocusManager();
  const addItems = useCallback(
    (items) => {
      items = (items || []).filter((item) => {
        const invalid = !item || !item.id || !item.name;
        const alreadyExists = chips.findIndex((cr) => cr.id === (item == null ? void 0 : item.id)) > -1;
        return !alreadyExists && !invalid;
      });
      if (!items.length)
        return;
      if (validateWith) {
        items = items.map((item) => validateWith(item));
      }
      setChips([...chips, ...items]);
    },
    [chips, setChips, validateWith]
  );
  const listbox = useListbox({
    ...props,
    clearInputOnItemSelection: true,
    isOpen: listboxIsOpen,
    onOpenChange: setListboxIsOpen,
    items: suggestions,
    selectionMode: "none",
    role: "listbox",
    virtualFocus: true,
    onItemSelected: (value) => {
      handleItemSelection(value);
    }
  });
  const {
    state: {
      activeIndex,
      setActiveIndex,
      isOpen,
      setIsOpen,
      inputValue,
      setInputValue
    },
    refs,
    listboxId,
    collection,
    onInputChange
  } = listbox;
  const handleItemSelection = (textValue) => {
    const option = collection.size && activeIndex != null ? [...collection.values()][activeIndex] : null;
    if (option == null ? void 0 : option.item) {
      addItems([option.item]);
    } else if (allowCustomValue) {
      addItems([stringToChipValue(option ? option.value : textValue)]);
    }
    setInputValue("");
    setActiveIndex(null);
    setIsOpen(false);
  };
  useLayoutEffect(() => {
    if (fieldRef.current && refs.reference.current !== fieldRef.current) {
      listbox.reference(fieldRef.current);
    }
  }, [fieldRef, listbox, refs]);
  const { handleTriggerKeyDown, handleListboxKeyboardNavigation } = useListboxKeyboardNavigation(listbox);
  const handleFocusAndClick = createEventHandler(() => {
    if (openMenuOnFocus && !isOpen) {
      setIsOpen(true);
    }
  });
  return /* @__PURE__ */ jsx(
    Listbox,
    {
      listbox,
      mobileOverlay: Popover,
      isLoading,
      onPointerDown: (e) => {
        e.preventDefault();
      },
      children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          className: clsx(
            "mx-8 my-4 min-w-30 flex-[1_1_60px] bg-transparent text-sm outline-none",
            size === "xs" ? "h-20" : "h-30"
          ),
          placeholder,
          ...mergeProps(inputProps, {
            ref: inputRef,
            value: inputValue,
            onChange: onInputChange,
            onPaste: (e) => {
              const paste = e.clipboardData.getData("text");
              const emails = paste.match(
                /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
              );
              if (emails) {
                e.preventDefault();
                const selection = window.getSelection();
                if (selection == null ? void 0 : selection.rangeCount) {
                  selection.deleteFromDocument();
                  addItems(emails.map((email) => stringToChipValue(email)));
                }
              }
            },
            "aria-autocomplete": "list",
            "aria-controls": isOpen ? listboxId : void 0,
            autoComplete: "off",
            autoCorrect: "off",
            spellCheck: "false",
            onKeyDown: (e) => {
              const input = e.target;
              if (e.key === "Enter") {
                e.preventDefault();
                handleItemSelection(input.value);
                return;
              }
              if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
                setInputValue("");
              }
              if (e.key === "ArrowUp" && isOpen && (activeIndex === 0 || activeIndex == null)) {
                setActiveIndex(null);
                return;
              }
              if (activeIndex != null && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
                e.preventDefault();
                return;
              }
              if ((e.key === "ArrowLeft" || e.key === "Backspace" || e.key === "Delete") && input.selectionStart === 0 && activeIndex == null && chips.length) {
                manager == null ? void 0 : manager.focusPrevious({ tabbable: true });
                return;
              }
              const handled = handleTriggerKeyDown(e);
              if (!handled) {
                handleListboxKeyboardNavigation(e);
              }
            },
            onFocus: handleFocusAndClick,
            onClick: handleFocusAndClick
          })
        }
      )
    }
  );
}
function useChipFieldValueState({
  onChange,
  value,
  defaultValue,
  valueKey
}) {
  const propsValue = useMemo(() => {
    return mixedValueToChipValue(value);
  }, [value]);
  const propsDefaultValue = useMemo(() => {
    return mixedValueToChipValue(defaultValue);
  }, [defaultValue]);
  const handleChange = useCallback(
    (value2) => {
      const newValue = valueKey ? value2.map((v) => v[valueKey]) : value2;
      onChange == null ? void 0 : onChange(newValue);
    },
    [onChange, valueKey]
  );
  return useControlledState(
    !propsValue ? void 0 : propsValue,
    propsDefaultValue || [],
    handleChange
  );
}
function mixedValueToChipValue(value) {
  if (value == null) {
    return void 0;
  }
  return value.map((v) => {
    return typeof v !== "object" ? stringToChipValue(v) : v;
  });
}
const ChipField = React.forwardRef(ChipFieldInner);
function FormChipField({ children, ...props }) {
  const {
    field: { onChange, onBlur, value = [], ref },
    fieldState: { invalid, error }
  } = useController({
    name: props.name
  });
  const formProps = {
    onChange,
    onBlur,
    value,
    invalid,
    errorMessage: error == null ? void 0 : error.message
  };
  return /* @__PURE__ */ jsx(ChipField, { ref, ...mergeProps(formProps, props), children });
}
function ChipFieldFilterPanel({
  filter
}) {
  const { trans } = useTrans();
  return /* @__PURE__ */ jsx(
    FormChipField,
    {
      size: "sm",
      name: `${filter.key}.value`,
      valueKey: "id",
      allowCustomValue: false,
      showDropdownArrow: true,
      placeholder: filter.control.placeholder ? trans(filter.control.placeholder) : void 0,
      displayWith: (chip) => {
        var _a2;
        return (_a2 = filter.control.options.find((o) => o.key === chip.id)) == null ? void 0 : _a2.label.message;
      },
      suggestions: filter.control.options.map((o) => ({
        id: o.key,
        name: o.label.message
      })),
      children: (chip) => /* @__PURE__ */ jsx(Item, { value: chip.id, children: /* @__PURE__ */ jsx(Trans, { message: chip.name }) }, chip.id)
    }
  );
}
const FilterListTriggerButton = forwardRef((props, ref) => {
  const { isInactive, filter, ...domProps } = props;
  if (isInactive) {
    return /* @__PURE__ */ jsx(InactiveFilterButton, { filter, ...domProps, ref });
  }
  return /* @__PURE__ */ jsx(ActiveFilterButton, { filter, ...domProps, ref });
});
const InactiveFilterButton = forwardRef(({ filter, ...domProps }, ref) => {
  return /* @__PURE__ */ jsx(
    Button,
    {
      variant: "outline",
      size: "xs",
      color: "paper",
      radius: "rounded-md",
      border: "border",
      ref,
      endIcon: /* @__PURE__ */ jsx(KeyboardArrowDownIcon, {}),
      ...domProps,
      children: /* @__PURE__ */ jsx(Trans, { ...filter.label })
    }
  );
});
const ActiveFilterButton = forwardRef(({ filter, children, ...domProps }, ref) => {
  const isBoolean = filter.control.type === FilterControlType.BooleanToggle;
  return /* @__PURE__ */ jsxs(
    Button,
    {
      variant: "outline",
      size: "xs",
      color: "primary",
      radius: "rounded-r-md",
      border: "border-y border-r",
      endIcon: !isBoolean && /* @__PURE__ */ jsx(KeyboardArrowDownIcon, {}),
      ref,
      ...domProps,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: clsx(
              !isBoolean && "border-r border-r-primary-light mr-8 pr-8"
            ),
            children: /* @__PURE__ */ jsx(Trans, { ...filter.label })
          }
        ),
        children
      ]
    }
  );
});
function FilterListItemDialogTrigger(props) {
  const { onValueChange, isInactive, filter, label } = props;
  return /* @__PURE__ */ jsxs(
    DialogTrigger,
    {
      offset: 10,
      type: "popover",
      onClose: (value) => {
        if (value !== void 0) {
          onValueChange(value);
        }
      },
      children: [
        /* @__PURE__ */ jsx(FilterListTriggerButton, { isInactive, filter, children: label }),
        /* @__PURE__ */ jsx(FilterListControlDialog, { ...props })
      ]
    }
  );
}
function FilterListControlDialog({
  filter,
  panel,
  value,
  operator
}) {
  const form = useForm({
    defaultValues: {
      [filter.key]: { value, operator }
    }
  });
  const { close, formId } = useDialogContext();
  return /* @__PURE__ */ jsxs(Dialog, { size: "xs", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(Trans, { ...filter.label }) }),
    /* @__PURE__ */ jsx(DialogBody, { padding: "px-14 pt-14 pb-4 max-h-288", children: /* @__PURE__ */ jsxs(
      Form,
      {
        form,
        id: formId,
        onSubmit: (formValue) => {
          close(formValue[filter.key]);
        },
        children: [
          filter.description && /* @__PURE__ */ jsx("div", { className: "text-muted text-xs mb-14", children: /* @__PURE__ */ jsx(Trans, { ...filter.description }) }),
          panel
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsx(
      Button,
      {
        form: formId,
        type: "submit",
        variant: "flat",
        color: "primary",
        size: "xs",
        children: /* @__PURE__ */ jsx(Trans, { message: "Apply" })
      }
    ) })
  ] });
}
const FormattedNumber = memo(
  ({ value, ...options }) => {
    const formatter = useNumberFormatter(options);
    if (isNaN(value)) {
      value = 0;
    }
    return /* @__PURE__ */ jsx(Fragment, { children: formatter.format(value) });
  },
  shallowEqual
);
function FilterListControl(props) {
  switch (props.filter.control.type) {
    case FilterControlType.DateRangePicker:
      return /* @__PURE__ */ jsx(DatePickerControl, { ...props });
    case FilterControlType.BooleanToggle:
      return /* @__PURE__ */ jsx(BooleanToggleControl, { ...props });
    case FilterControlType.Select:
      return /* @__PURE__ */ jsx(SelectControl, { ...props });
    case FilterControlType.ChipField:
      return /* @__PURE__ */ jsx(ChipFieldControl, { ...props });
    case FilterControlType.Input:
      return /* @__PURE__ */ jsx(InputControl, { ...props });
    case FilterControlType.SelectModel:
      return /* @__PURE__ */ jsx(SelectModelControl, { ...props });
    case FilterControlType.Custom:
      const Control = props.filter.control.listItem;
      return /* @__PURE__ */ jsx(Control, { ...props });
    default:
      return null;
  }
}
function DatePickerControl(props) {
  const { value, filter } = props;
  let valueLabel;
  if (value.preset !== void 0) {
    valueLabel = /* @__PURE__ */ jsx(Trans, { ...DateRangePresets[value.preset].label });
  } else {
    valueLabel = /* @__PURE__ */ jsx(
      FormattedDateTimeRange,
      {
        start: new Date(value.start),
        end: new Date(value.end),
        options: { dateStyle: "medium" }
      }
    );
  }
  return /* @__PURE__ */ jsx(
    FilterListItemDialogTrigger,
    {
      ...props,
      label: valueLabel,
      panel: /* @__PURE__ */ jsx(DateRangeFilterPanel, { filter })
    }
  );
}
function BooleanToggleControl({
  filter,
  isInactive,
  onValueChange
}) {
  return /* @__PURE__ */ jsx(
    FilterListTriggerButton,
    {
      onClick: () => {
        onValueChange({ value: filter.control.defaultValue });
      },
      filter,
      isInactive
    }
  );
}
function SelectControl(props) {
  const { filter, value } = props;
  const option = filter.control.options.find((o) => o.key === value);
  return /* @__PURE__ */ jsx(
    FilterListItemDialogTrigger,
    {
      ...props,
      label: option ? /* @__PURE__ */ jsx(Trans, { ...option.label }) : null,
      panel: /* @__PURE__ */ jsx(SelectFilterPanel, { filter })
    }
  );
}
function ChipFieldControl(props) {
  return /* @__PURE__ */ jsx(
    FilterListItemDialogTrigger,
    {
      ...props,
      label: /* @__PURE__ */ jsx(MultipleValues, { ...props }),
      panel: /* @__PURE__ */ jsx(ChipFieldFilterPanel, { filter: props.filter })
    }
  );
}
function MultipleValues(props) {
  const { trans } = useTrans();
  const { filter, value } = props;
  const options = value.map((v) => filter.control.options.find((o) => o.key === v));
  const maxShownCount = 3;
  const notShownCount = value.length - maxShownCount;
  const names = /* @__PURE__ */ jsx(Fragment, { children: options.filter(Boolean).slice(0, maxShownCount).map((o, i) => {
    let name = "";
    if (i !== 0) {
      name += ", ";
    }
    name += trans(o.label);
    return name;
  }) });
  return notShownCount > 0 ? /* @__PURE__ */ jsx(
    Trans,
    {
      message: ":names + :count more",
      values: { names, count: notShownCount }
    }
  ) : names;
}
function InputControl(props) {
  const { filter, value, operator } = props;
  const operatorLabel = operator ? /* @__PURE__ */ jsx(Trans, { ...FilterOperatorNames[operator] }) : null;
  const formattedValue = filter.control.inputType === "number" ? /* @__PURE__ */ jsx(FormattedNumber, { value }) : value;
  return /* @__PURE__ */ jsx(
    FilterListItemDialogTrigger,
    {
      ...props,
      label: /* @__PURE__ */ jsxs(Fragment, { children: [
        operatorLabel,
        " ",
        formattedValue
      ] }),
      panel: /* @__PURE__ */ jsx(InputFilterPanel, { filter })
    }
  );
}
function SelectModelControl(props) {
  const { value, filter } = props;
  const { isLoading, data } = useNormalizedModel(
    `normalized-models/${filter.control.model}/${value}`,
    void 0,
    { enabled: !!value }
  );
  const skeleton = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Skeleton, { variant: "avatar", size: "w-18 h-18 mr-6" }),
    /* @__PURE__ */ jsx(Skeleton, { variant: "rect", size: "w-50" })
  ] });
  const modelPreview = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Avatar, { size: "xs", src: data == null ? void 0 : data.model.image, className: "mr-6" }),
    data == null ? void 0 : data.model.name
  ] });
  const label = isLoading || !data ? skeleton : modelPreview;
  return /* @__PURE__ */ jsx(
    FilterListItemDialogTrigger,
    {
      ...props,
      label,
      panel: /* @__PURE__ */ jsx(NormalizedModelFilterPanel, { filter })
    }
  );
}
function FilterList({
  filters,
  pinnedFilters,
  className
}) {
  const { decodedFilters, remove, replaceAll } = useBackendFilterUrlParams(
    filters,
    pinnedFilters
  );
  if (!decodedFilters.length)
    return null;
  return /* @__PURE__ */ jsx("div", { className: clsx("flex items-center gap-6 overflow-x-auto", className), children: decodedFilters.map((field, index) => {
    const filter = filters.find((f) => f.key === field.key);
    if (!filter)
      return null;
    const handleValueChange = (payload) => {
      const newFilters = [...decodedFilters];
      newFilters.splice(index, 1, {
        key: filter.key,
        value: payload.value,
        isInactive: false,
        operator: payload.operator || filter.defaultOperator
      });
      replaceAll(newFilters);
    };
    return /* @__PURE__ */ jsxs("div", { children: [
      !field.isInactive && /* @__PURE__ */ jsx(
        IconButton,
        {
          variant: "outline",
          color: "primary",
          size: "xs",
          radius: "rounded-l-md",
          onClick: () => {
            remove(field.key);
          },
          children: /* @__PURE__ */ jsx(CloseIcon, {})
        }
      ),
      /* @__PURE__ */ jsx(
        FilterListControl,
        {
          filter,
          isInactive: field.isInactive,
          value: field.valueKey != null ? field.valueKey : field.value,
          operator: field.operator,
          onValueChange: handleValueChange
        }
      )
    ] }, field.key);
  }) });
}
const AddIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" }),
  "AddOutlined"
);
const FileDownloadIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z" }),
  "FileDownloadOutlined"
);
function downloadFileFromUrl(url, name) {
  const link = document.createElement("a");
  link.href = url;
  if (name)
    link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function useDatePickerState(props) {
  const now2 = useCurrentDateTime();
  const [isPlaceholder, setIsPlaceholder] = useState(
    !props.value && !props.defaultValue
  );
  const setStateValue = props.onChange;
  const [internalValue, setInternalValue] = useControlledState(
    props.value || now2,
    props.defaultValue || now2,
    (value) => {
      setIsPlaceholder(false);
      setStateValue == null ? void 0 : setStateValue(value);
    }
  );
  const {
    min,
    max,
    granularity,
    timezone,
    calendarIsOpen,
    setCalendarIsOpen,
    closeDialogOnSelection
  } = useBaseDatePickerState(internalValue, props);
  const clear = useCallback(() => {
    setIsPlaceholder(true);
    setInternalValue(now2);
    setStateValue == null ? void 0 : setStateValue(null);
    setCalendarIsOpen(false);
  }, [now2, setInternalValue, setStateValue, setCalendarIsOpen]);
  const [calendarDates, setCalendarDates] = useState(() => {
    return [toCalendarDate(internalValue)];
  });
  const setSelectedValue = useCallback(
    (newValue) => {
      if (min && newValue.compare(min) < 0) {
        newValue = min;
      } else if (max && newValue.compare(max) > 0) {
        newValue = max;
      }
      const value = internalValue ? internalValue.set(newValue) : toZoned(newValue, timezone);
      setInternalValue(value);
      setCalendarDates([toCalendarDate(value)]);
      setIsPlaceholder(false);
    },
    [setInternalValue, min, max, internalValue, timezone]
  );
  const dayIsActive = useCallback(
    (day) => !isPlaceholder && isSameDay(internalValue, day),
    [internalValue, isPlaceholder]
  );
  const getCellProps = useCallback(
    (date) => {
      return {
        onClick: () => {
          setSelectedValue == null ? void 0 : setSelectedValue(date);
          if (closeDialogOnSelection) {
            setCalendarIsOpen == null ? void 0 : setCalendarIsOpen(false);
          }
        }
      };
    },
    [setSelectedValue, setCalendarIsOpen, closeDialogOnSelection]
  );
  return {
    selectedValue: internalValue,
    setSelectedValue: setInternalValue,
    calendarIsOpen,
    setCalendarIsOpen,
    dayIsActive,
    dayIsHighlighted: () => false,
    dayIsRangeStart: () => false,
    dayIsRangeEnd: () => false,
    getCellProps,
    calendarDates,
    setCalendarDates,
    isPlaceholder,
    clear,
    setIsPlaceholder,
    min,
    max,
    granularity,
    timezone,
    closeDialogOnSelection
  };
}
function DatePicker({ showCalendarFooter, ...props }) {
  const state = useDatePickerState(props);
  const inputRef = useRef(null);
  const now2 = useCurrentDateTime();
  const footer = showCalendarFooter && /* @__PURE__ */ jsx(
    DialogFooter,
    {
      padding: "px-14 pb-14",
      startAction: /* @__PURE__ */ jsx(
        Button,
        {
          disabled: state.isPlaceholder,
          variant: "text",
          color: "primary",
          onClick: () => {
            state.clear();
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Clear" })
        }
      ),
      children: /* @__PURE__ */ jsx(
        Button,
        {
          variant: "text",
          color: "primary",
          onClick: () => {
            state.setSelectedValue(now2);
            state.setCalendarIsOpen(false);
          },
          children: /* @__PURE__ */ jsx(Trans, { message: "Today" })
        }
      )
    }
  );
  const dialog = /* @__PURE__ */ jsx(
    DialogTrigger,
    {
      offset: 8,
      placement: "bottom-start",
      isOpen: state.calendarIsOpen,
      onOpenChange: state.setCalendarIsOpen,
      type: "popover",
      triggerRef: inputRef,
      returnFocusToTrigger: false,
      moveFocusToDialog: false,
      children: /* @__PURE__ */ jsxs(Dialog, { size: "auto", children: [
        /* @__PURE__ */ jsx(
          DialogBody,
          {
            className: "flex items-start gap-40",
            padding: showCalendarFooter ? "px-24 pt-20 pb-10" : null,
            children: /* @__PURE__ */ jsx(Calendar, { state, visibleMonths: 1 })
          }
        ),
        footer
      ] })
    }
  );
  const openOnClick = {
    onClick: (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!isHourSegment(e)) {
        state.setCalendarIsOpen(true);
      } else {
        state.setCalendarIsOpen(false);
      }
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      DatePickerField,
      {
        ref: inputRef,
        wrapperProps: openOnClick,
        endAdornment: /* @__PURE__ */ jsx(DateRangeIcon, { className: clsx(props.disabled && "text-disabled") }),
        ...props,
        children: /* @__PURE__ */ jsx(
          DateSegmentList,
          {
            segmentProps: openOnClick,
            state,
            value: state.selectedValue,
            onChange: state.setSelectedValue,
            isPlaceholder: state.isPlaceholder
          }
        )
      }
    ),
    dialog
  ] });
}
function FormDatePicker(props) {
  const { min, max } = props;
  const { trans } = useTrans();
  const { format } = useDateFormatter();
  const {
    field: { onChange, onBlur, value = null, ref },
    fieldState: { invalid, error }
  } = useController({
    name: props.name,
    rules: {
      validate: (v) => {
        if (!v)
          return;
        const date = parseAbsoluteToLocal(v);
        if (min && date.compare(min) < 0) {
          return trans({
            message: "Enter a date after :date",
            values: { date: format(v) }
          });
        }
        if (max && date.compare(max) > 0) {
          return trans({
            message: "Enter a date before :date",
            values: { date: format(v) }
          });
        }
      }
    }
  });
  const parsedValue = value ? parseAbsoluteToLocal(value) : null;
  const formProps = {
    onChange: (e) => {
      onChange(e ? e.toAbsoluteString() : e);
    },
    onBlur,
    value: parsedValue,
    invalid,
    errorMessage: error == null ? void 0 : error.message,
    inputRef: ref
  };
  return /* @__PURE__ */ jsx(DatePicker, { ...mergeProps(formProps, props) });
}
function isHourSegment(e) {
  return ["hour", "minute", "dayPeriod"].includes(
    e.currentTarget.ariaLabel || ""
  );
}
const DeleteIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" }),
  "DeleteOutlined"
);
const draggables = /* @__PURE__ */ new Map();
const droppables = /* @__PURE__ */ new Map();
const dragMonitors = /* @__PURE__ */ new Map();
const dragSession = {
  status: "inactive"
};
function interactableEvent({
  e,
  rect,
  deltaX,
  deltaY
}) {
  return {
    rect,
    x: e.clientX,
    y: e.clientY,
    deltaX: deltaX ?? 0,
    deltaY: deltaY ?? 0,
    nativeEvent: e
  };
}
let activeInteraction = null;
function setActiveInteraction(name) {
  activeInteraction = name;
}
function domRectToObj(rect) {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height
  };
}
function updateRects(targets) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { width, height, left, top } = entry.boundingClientRect;
      const [id, target] = [...targets].find(
        ([, target2]) => target2.ref.current === entry.target
      ) || [];
      if (id == null || target == null)
        return;
      const rect = {
        width,
        height,
        left,
        top
      };
      targets.set(id, { ...target, rect });
    });
    observer.disconnect();
  });
  [...targets.values()].forEach((target) => {
    if (target.ref.current) {
      observer.observe(target.ref.current);
    }
  });
}
function useDraggable({
  id,
  disabled,
  ref,
  preview,
  hidePreview,
  ...options
}) {
  const dragHandleRef = useRef(null);
  const { addGlobalListener, removeAllGlobalListeners } = useGlobalListeners();
  const state = useRef({
    lastPosition: { x: 0, y: 0 }
  }).current;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  useLayoutEffect$1(() => {
    if (!disabled) {
      draggables.set(id, {
        ...draggables.get(id),
        id,
        ref,
        type: optionsRef.current.type,
        getData: optionsRef.current.getData
      });
    } else {
      draggables.delete(id);
    }
    return () => {
      draggables.delete(id);
    };
  }, [id, disabled, optionsRef, ref]);
  const notifyMonitors = (callback) => {
    dragMonitors.forEach((monitor) => {
      var _a2;
      if (monitor.type === ((_a2 = draggables.get(id)) == null ? void 0 : _a2.type)) {
        callback(monitor);
      }
    });
  };
  const onDragStart = (e) => {
    var _a2, _b2;
    const draggable = draggables.get(id);
    const el = ref.current;
    const clickedOnHandle = !dragHandleRef.current || !state.clickedEl || dragHandleRef.current.contains(state.clickedEl);
    if (activeInteraction || !el || !draggable || !clickedOnHandle) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    updateRects(droppables);
    setActiveInteraction("drag");
    if (hidePreview) {
      hideNativeGhostImage(e);
    }
    e.dataTransfer.effectAllowed = "move";
    state.lastPosition = { x: e.clientX, y: e.clientY };
    state.currentRect = domRectToObj(el.getBoundingClientRect());
    const ie = interactableEvent({ rect: state.currentRect, e });
    if (preview == null ? void 0 : preview.current) {
      preview.current(draggable, (node) => {
        e.dataTransfer.setDragImage(node, 0, 0);
      });
    }
    dragSession.status = "dragging";
    dragSession.dragTargetId = id;
    if (ref.current) {
      ref.current.dataset.dragging = "true";
    }
    (_b2 = (_a2 = optionsRef.current).onDragStart) == null ? void 0 : _b2.call(_a2, ie, draggable);
    requestAnimationFrame(() => {
      notifyMonitors((m2) => {
        var _a3;
        return (_a3 = m2.onDragStart) == null ? void 0 : _a3.call(m2, ie, draggable);
      });
    });
    addGlobalListener(window, "dragover", onDragOver, true);
  };
  const onDragOver = (e) => {
    var _a2, _b2;
    e.preventDefault();
    if (!state.currentRect)
      return;
    const deltaX = e.clientX - state.lastPosition.x;
    const deltaY = e.clientY - state.lastPosition.y;
    const newRect = {
      ...state.currentRect,
      left: state.currentRect.left + deltaX,
      top: state.currentRect.top + deltaY
    };
    const ie = interactableEvent({ rect: newRect, e, deltaX, deltaY });
    const target = draggables.get(id);
    if (target) {
      (_b2 = (_a2 = optionsRef.current).onDragMove) == null ? void 0 : _b2.call(_a2, ie, target);
      notifyMonitors((m2) => {
        var _a3;
        return (_a3 = m2.onDragMove) == null ? void 0 : _a3.call(m2, ie, target);
      });
    }
    state.lastPosition = { x: e.clientX, y: e.clientY };
    state.currentRect = newRect;
  };
  const onDragEnd = (e) => {
    var _a2, _b2;
    removeAllGlobalListeners();
    if (!state.currentRect)
      return;
    setActiveInteraction(null);
    if (emptyImage) {
      emptyImage.remove();
    }
    const ie = interactableEvent({ rect: state.currentRect, e });
    const draggable = draggables.get(id);
    if (draggable) {
      (_b2 = (_a2 = optionsRef.current).onDragEnd) == null ? void 0 : _b2.call(_a2, ie, draggable);
      notifyMonitors((m2) => {
        var _a3;
        return (_a3 = m2.onDragEnd) == null ? void 0 : _a3.call(m2, ie, draggable, dragSession.status);
      });
    }
    requestAnimationFrame(() => {
      dragSession.dragTargetId = void 0;
      dragSession.status = "inactive";
      if (ref.current) {
        delete ref.current.dataset.dragging;
      }
    });
  };
  const draggableProps = {
    draggable: !disabled,
    onDragStart,
    onDragEnd,
    onPointerDown: (e) => {
      state.clickedEl = e.target;
    }
  };
  return { draggableProps, dragHandleRef };
}
let emptyImage;
function hideNativeGhostImage(e) {
  if (!emptyImage) {
    emptyImage = new Image();
    document.body.append(emptyImage);
    emptyImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
  }
  e.dataTransfer.setDragImage(emptyImage, 0, 0);
}
async function* readFilesFromDataTransfer(dataTransfer) {
  const entries = [];
  for (const item of dataTransfer.items) {
    if (item.kind === "file") {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        entries.push(entry);
      }
    }
  }
  for (const entry of entries) {
    if (entry.isFile) {
      if (entry.name === ".DS_Store")
        continue;
      const file = await getEntryFile(entry);
      yield new UploadedFile(file, entry.fullPath);
    } else if (entry.isDirectory) {
      yield* getEntriesFromDirectory(entry);
    }
  }
}
async function* getEntriesFromDirectory(item) {
  const reader = item.createReader();
  let entries;
  do {
    entries = await new Promise((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });
    for (const entry of entries) {
      if (entry.isFile) {
        if (entry.name === ".DS_Store")
          continue;
        const file = await getEntryFile(entry);
        yield new UploadedFile(file, entry.fullPath);
      } else if (entry.isDirectory) {
        yield* getEntriesFromDirectory(entry);
      }
    }
  } while (entries.length > 0);
}
function getEntryFile(entry) {
  return new Promise((resolve, reject) => entry.file(resolve, reject));
}
async function asyncIterableToArray(iterator) {
  const items = [];
  for await (const item of iterator) {
    items.push(item);
  }
  return items;
}
const DROP_ACTIVATE_TIMEOUT = 400;
function useDroppable({
  id,
  disabled,
  ref,
  ...options
}) {
  const state = useRef({
    dragOverElements: /* @__PURE__ */ new Set(),
    dropActivateTimer: void 0
  }).current;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  useLayoutEffect$1(() => {
    droppables.set(id, {
      ...droppables.get(id),
      disabled,
      id,
      ref
    });
    return () => {
      droppables.delete(id);
    };
  }, [id, optionsRef, disabled, ref]);
  const canDrop = (draggable) => {
    var _a2;
    const options2 = optionsRef.current;
    const allowEventsOnSelf = options2.allowDragEventsFromItself || ref.current !== ((_a2 = draggable.ref) == null ? void 0 : _a2.current);
    return !!((draggable == null ? void 0 : draggable.type) && allowEventsOnSelf && options2.types.includes(draggable.type) && (!options2.acceptsDrop || options2.acceptsDrop(draggable)));
  };
  const fireDragLeave = (e) => {
    var _a2, _b2;
    const draggable = getDraggable(e);
    if (draggable) {
      (_b2 = (_a2 = optionsRef.current).onDragLeave) == null ? void 0 : _b2.call(_a2, draggable);
    }
  };
  const onDragEnter = (e) => {
    var _a2, _b2;
    e.stopPropagation();
    state.dragOverElements.add(e.target);
    if (state.dragOverElements.size > 1) {
      return;
    }
    const draggable = getDraggable(e);
    if (draggable && canDrop(draggable)) {
      (_b2 = (_a2 = optionsRef.current).onDragEnter) == null ? void 0 : _b2.call(_a2, draggable);
      clearTimeout(state.dropActivateTimer);
      if (typeof optionsRef.current.onDropActivate === "function") {
        state.dropActivateTimer = setTimeout(() => {
          var _a3, _b3;
          if (draggable) {
            (_b3 = (_a3 = optionsRef.current).onDropActivate) == null ? void 0 : _b3.call(_a3, draggable);
          }
        }, DROP_ACTIVATE_TIMEOUT);
      }
    }
  };
  const onDragLeave = (e) => {
    e.stopPropagation();
    state.dragOverElements.delete(e.target);
    for (const element of state.dragOverElements) {
      if (!e.currentTarget.contains(element)) {
        state.dragOverElements.delete(element);
      }
    }
    if (state.dragOverElements.size > 0) {
      return;
    }
    const draggable = getDraggable(e);
    if (draggable && canDrop(draggable)) {
      fireDragLeave(e);
      clearTimeout(state.dropActivateTimer);
    }
  };
  const onDrop = async (e) => {
    var _a2, _b2, _c, _d;
    e.preventDefault();
    e.stopPropagation();
    state.dragOverElements.clear();
    fireDragLeave(e);
    clearTimeout(state.dropActivateTimer);
    const draggable = getDraggable(e);
    if (draggable) {
      (_b2 = (_a2 = optionsRef.current).onDragLeave) == null ? void 0 : _b2.call(_a2, draggable);
      if (!canDrop(draggable)) {
        if (dragSession.status !== "inactive") {
          dragSession.status = "dropFail";
        }
      } else {
        const dropResult = (_d = (_c = optionsRef.current).onDrop) == null ? void 0 : _d.call(_c, draggable);
        if (dragSession.status !== "inactive") {
          dragSession.status = dropResult === false ? "dropFail" : "dropSuccess";
        }
      }
    }
  };
  const droppableProps = {
    onDragOver: (e) => {
      var _a2, _b2;
      e.preventDefault();
      e.stopPropagation();
      const draggable = getDraggable(e);
      if (draggable && canDrop(draggable)) {
        (_b2 = (_a2 = optionsRef.current).onDragOver) == null ? void 0 : _b2.call(_a2, draggable, e);
      }
    },
    onDragEnter,
    onDragLeave,
    onDrop
  };
  return {
    droppableProps: disabled ? {} : droppableProps
  };
}
function getDraggable(e) {
  if (dragSession.dragTargetId != null) {
    return draggables.get(dragSession.dragTargetId);
  } else if (e.dataTransfer.types.includes("Files")) {
    return {
      type: "nativeFile",
      el: null,
      ref: null,
      getData: () => {
        return asyncIterableToArray(readFilesFromDataTransfer(e.dataTransfer));
      }
    };
  }
}
const USER_MODEL = "user";
const LinkIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z" }),
  "LinkOutlined"
);
const MoreVertIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }),
  "MoreVertOutlined"
);
const FileEntryUrlsContext = React.createContext(null);
function useFileEntryUrls(entry, options) {
  const { base_url } = useSettings();
  const urlSearchParams = useContext(FileEntryUrlsContext);
  return useMemo(() => {
    if (!entry) {
      return {};
    }
    let previewUrl;
    if (entry.url) {
      previewUrl = isAbsoluteUrl(entry.url) ? entry.url : `${base_url}/${entry.url}`;
    }
    const urls = {
      previewUrl,
      downloadUrl: `${base_url}/api/v1/file-entries/download/${(options == null ? void 0 : options.downloadHashes) || entry.hash}`
    };
    if (urlSearchParams) {
      if (urls.previewUrl) {
        urls.previewUrl = addParams(
          urls.previewUrl,
          { ...urlSearchParams, thumbnail: (options == null ? void 0 : options.thumbnail) ? "true" : "" },
          base_url
        );
      }
      urls.downloadUrl = addParams(urls.downloadUrl, urlSearchParams, base_url);
    }
    return urls;
  }, [
    base_url,
    entry,
    options == null ? void 0 : options.downloadHashes,
    options == null ? void 0 : options.thumbnail,
    urlSearchParams
  ]);
}
function addParams(urlString, params, baseUrl) {
  const url = new URL(urlString, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}
const FilePreviewContext = React.createContext(
  null
);
function DefaultFilePreview({ message: message2, className, allowDownload }) {
  const { entries, activeIndex } = useContext(FilePreviewContext);
  const activeEntry = entries[activeIndex];
  const content = message2 || /* @__PURE__ */ jsx(Trans, { message: "No file preview available" });
  const { downloadUrl } = useFileEntryUrls(activeEntry);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: clsx(
        className,
        "shadow bg-paper max-w-400 w-[calc(100%-40px)] text-center p-40 rounded"
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "text-lg", children: content }),
        allowDownload && /* @__PURE__ */ jsx("div", { className: "block mt-20 text-center", children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "flat",
            color: "primary",
            onClick: () => {
              if (downloadUrl) {
                downloadFileFromUrl(downloadUrl);
              }
            },
            children: /* @__PURE__ */ jsx(Trans, { message: "Download" })
          }
        ) })
      ]
    }
  );
}
function ImageFilePreview(props) {
  const { entry, className } = props;
  const { trans } = useTrans();
  const { previewUrl } = useFileEntryUrls(entry);
  if (!previewUrl) {
    return /* @__PURE__ */ jsx(DefaultFilePreview, { ...props });
  }
  return /* @__PURE__ */ jsx(
    "img",
    {
      className: clsx(className, "shadow"),
      src: previewUrl,
      alt: trans({
        message: "Preview for :name",
        values: { name: entry.name }
      })
    }
  );
}
const FIVE_MB = 5242880;
function TextFilePreview(props) {
  const { entry, className } = props;
  const { trans } = useTrans();
  const [tooLarge, setTooLarge] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFailed, setIsFailed] = useState(false);
  const [contents, setContents] = useState(null);
  const { previewUrl } = useFileEntryUrls(entry);
  useEffect(() => {
    if (!entry)
      return;
    if (!previewUrl) {
      setIsFailed(true);
    } else if (entry.file_size >= FIVE_MB) {
      setTooLarge(true);
      setIsLoading(false);
    } else {
      getFileContents(previewUrl).then((response) => {
        setContents(response.data);
      }).catch(() => {
        setIsFailed(true);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [entry, previewUrl]);
  if (isLoading) {
    return /* @__PURE__ */ jsx(
      ProgressCircle,
      {
        isIndeterminate: true,
        "aria-label": trans({ message: "Loading file contents" })
      }
    );
  }
  if (tooLarge) {
    return /* @__PURE__ */ jsx(
      DefaultFilePreview,
      {
        ...props,
        message: /* @__PURE__ */ jsx(Trans, { message: "This file is too large to preview." })
      }
    );
  }
  if (isFailed) {
    return /* @__PURE__ */ jsx(
      DefaultFilePreview,
      {
        ...props,
        message: /* @__PURE__ */ jsx(Trans, { message: "There was an issue previewing this file" })
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "pre",
    {
      className: clsx(
        "rounded bg-paper p-20 text-sm whitespace-pre-wrap break-words h-full overflow-y-auto w-full",
        className
      ),
      children: /* @__PURE__ */ jsx("div", { className: "container mx-auto", children: `${contents}` })
    }
  );
}
function getFileContents(src) {
  return apiClient.get(src, {
    responseType: "text",
    // required for s3 presigned url to work
    withCredentials: false,
    headers: {
      Accept: "text/plain"
    }
  });
}
function VideoFilePreview(props) {
  const { entry, className } = props;
  const { previewUrl } = useFileEntryUrls(entry);
  const ref = useRef(null);
  const [mediaInvalid, setMediaInvalid] = useState(false);
  useEffect(() => {
    var _a2;
    setMediaInvalid(!((_a2 = ref.current) == null ? void 0 : _a2.canPlayType(entry.mime)));
  }, [entry]);
  if (mediaInvalid || !previewUrl) {
    return /* @__PURE__ */ jsx(DefaultFilePreview, { ...props });
  }
  return /* @__PURE__ */ jsx(
    "video",
    {
      className,
      ref,
      controls: true,
      controlsList: "nodownload noremoteplayback",
      playsInline: true,
      autoPlay: true,
      children: /* @__PURE__ */ jsx(
        "source",
        {
          src: previewUrl,
          type: entry.mime,
          onError: () => {
            setMediaInvalid(true);
          }
        }
      )
    }
  );
}
function AudioFilePreview(props) {
  const { entry, className } = props;
  const { previewUrl } = useFileEntryUrls(entry);
  const ref = useRef(null);
  const [mediaInvalid, setMediaInvalid] = useState(false);
  useEffect(() => {
    var _a2;
    setMediaInvalid(!((_a2 = ref.current) == null ? void 0 : _a2.canPlayType(entry.mime)));
  }, [entry]);
  if (mediaInvalid || !previewUrl) {
    return /* @__PURE__ */ jsx(DefaultFilePreview, { ...props });
  }
  return /* @__PURE__ */ jsx(
    "audio",
    {
      className,
      ref,
      controls: true,
      controlsList: "nodownload noremoteplayback",
      autoPlay: true,
      children: /* @__PURE__ */ jsx(
        "source",
        {
          src: previewUrl,
          type: entry.mime,
          onError: () => {
            setMediaInvalid(true);
          }
        }
      )
    }
  );
}
function PdfFilePreview(props) {
  const { entry, className } = props;
  const { trans } = useTrans();
  const { previewUrl } = useFileEntryUrls(entry);
  if (!previewUrl) {
    return /* @__PURE__ */ jsx(DefaultFilePreview, { ...props });
  }
  return /* @__PURE__ */ jsx(
    "iframe",
    {
      title: trans({
        message: "Preview for :name",
        values: { name: entry.name }
      }),
      className: clsx(className, "w-full h-full"),
      src: `${previewUrl}#toolbar=0`
    }
  );
}
function WordDocumentFilePreview(props) {
  const { entry, className } = props;
  const { trans } = useTrans();
  const ref = useRef(null);
  const [showDefault, setShowDefault] = useState(false);
  const timeoutId = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { previewUrl } = useFileEntryUrls(entry);
  useEffect(() => {
    if (!previewUrl) {
      setShowDefault(true);
    } else if (entry.file_size && entry.file_size > 25e6) {
      setShowDefault(true);
    } else if (ref.current) {
      ref.current.onload = () => {
        clearTimeout(timeoutId.current);
        setIsLoading(false);
      };
      buildPreviewUrl(previewUrl, entry).then((url) => {
        if (ref.current) {
          ref.current.src = url;
        }
      });
      timeoutId.current = setTimeout(() => {
        setShowDefault(true);
      }, 5e3);
    }
  }, [entry, previewUrl]);
  if (showDefault) {
    return /* @__PURE__ */ jsx(DefaultFilePreview, { ...props });
  }
  return /* @__PURE__ */ jsxs("div", { className: clsx(className, "w-full h-full"), children: [
    isLoading && /* @__PURE__ */ jsx(ProgressCircle, {}),
    /* @__PURE__ */ jsx(
      "iframe",
      {
        ref,
        title: trans({
          message: "Preview for :name",
          values: { name: entry.name }
        }),
        className: clsx("w-full h-full", isLoading && "hidden")
      }
    )
  ] });
}
async function buildPreviewUrl(urlString, entry) {
  const url = new URL(urlString);
  if (!url.searchParams.has("shareable_link")) {
    const { data } = await apiClient.post(
      `file-entries/${entry.id}/add-preview-token`
    );
    url.searchParams.append("preview_token", data.preview_token);
  }
  return buildOfficeLivePreviewUrl(url);
}
function buildOfficeLivePreviewUrl(url) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    url.toString()
  )}`;
}
const AvailablePreviews = {
  text: TextFilePreview,
  video: VideoFilePreview,
  audio: AudioFilePreview,
  image: ImageFilePreview,
  pdf: PdfFilePreview,
  spreadsheet: WordDocumentFilePreview,
  powerPoint: WordDocumentFilePreview,
  word: WordDocumentFilePreview,
  "text/rtf": DefaultFilePreview
};
function getPreviewForEntry(entry) {
  const mime = entry == null ? void 0 : entry.mime;
  const type = entry == null ? void 0 : entry.type;
  return AvailablePreviews[mime] || AvailablePreviews[type] || DefaultFilePreview;
}
const ChevronLeftIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" }),
  "ChevronLeftOutlined"
);
const TwoMB = 2 * 1024 * 1024;
function FileThumbnail({
  file,
  className,
  iconClassName,
  showImage = true
}) {
  const { trans } = useTrans();
  const { previewUrl } = useFileEntryUrls(file, { thumbnail: true });
  if (file.file_size && file.file_size > TwoMB && !file.thumbnail) {
    showImage = false;
  }
  if (showImage && file.type === "image" && previewUrl) {
    const alt = trans({
      message: ":fileName thumbnail",
      values: { fileName: file.name }
    });
    return /* @__PURE__ */ jsx(
      "img",
      {
        className: clsx(className, "object-cover"),
        src: previewUrl,
        alt,
        draggable: false
      }
    );
  }
  return /* @__PURE__ */ jsx(FileTypeIcon, { className: iconClassName, type: file.type });
}
function FilePreviewContainer({
  entries,
  onClose,
  showHeader = true,
  className,
  headerActionsLeft,
  allowDownload = true,
  ...props
}) {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [activeIndex, setActiveIndex] = useControlledState(
    props.activeIndex,
    props.defaultActiveIndex || 0,
    props.onActiveIndexChange
  );
  const activeEntry = entries[activeIndex];
  const contextValue = useMemo(() => {
    return { entries, activeIndex };
  }, [entries, activeIndex]);
  const Preview = getPreviewForEntry(activeEntry);
  if (!activeEntry) {
    onClose == null ? void 0 : onClose();
    return null;
  }
  const canOpenNext = entries.length - 1 > activeIndex;
  const openNext = () => {
    setActiveIndex(activeIndex + 1);
  };
  const canOpenPrevious = activeIndex > 0;
  const openPrevious = () => {
    setActiveIndex(activeIndex - 1);
  };
  return /* @__PURE__ */ jsxs(FilePreviewContext.Provider, { value: contextValue, children: [
    showHeader && /* @__PURE__ */ jsx(
      Header,
      {
        actionsLeft: headerActionsLeft,
        isMobile,
        onClose,
        onNext: canOpenNext ? openNext : void 0,
        onPrevious: canOpenPrevious ? openPrevious : void 0,
        allowDownload
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: clsx("overflow-hidden relative flex-auto", className), children: [
      isMobile && /* @__PURE__ */ jsx(
        IconButton,
        {
          size: "lg",
          className: "text-muted absolute left-0 top-1/2 transform -translate-y-1/2 z-10",
          disabled: !canOpenPrevious,
          onClick: openPrevious,
          children: /* @__PURE__ */ jsx(KeyboardArrowLeftIcon, {})
        }
      ),
      /* @__PURE__ */ jsx(AnimatePresence, { initial: false, children: /* @__PURE__ */ jsx(
        m.div,
        {
          className: "absolute inset-0 flex items-center justify-center",
          ...opacityAnimation,
          children: /* @__PURE__ */ jsx(
            Preview,
            {
              className: "max-h-[calc(100%-30px)]",
              entry: activeEntry,
              allowDownload
            }
          )
        },
        activeEntry.id
      ) }),
      isMobile && /* @__PURE__ */ jsx(
        IconButton,
        {
          size: "lg",
          className: "text-muted absolute right-0 top-1/2 transform -translate-y-1/2 z-10",
          disabled: !canOpenNext,
          onClick: openNext,
          children: /* @__PURE__ */ jsx(KeyboardArrowRightIcon, {})
        }
      )
    ] })
  ] });
}
function Header({
  onNext,
  onPrevious,
  onClose,
  isMobile,
  actionsLeft,
  allowDownload
}) {
  const { entries, activeIndex } = useContext(FilePreviewContext);
  const activeEntry = entries[activeIndex];
  const { downloadUrl } = useFileEntryUrls(activeEntry);
  const desktopDownloadButton = /* @__PURE__ */ jsx(
    Button,
    {
      startIcon: /* @__PURE__ */ jsx(FileDownloadIcon, {}),
      variant: "text",
      onClick: () => {
        if (downloadUrl) {
          downloadFileFromUrl(downloadUrl);
        }
      },
      children: /* @__PURE__ */ jsx(Trans, { message: "Download" })
    }
  );
  const mobileDownloadButton = /* @__PURE__ */ jsx(
    IconButton,
    {
      onClick: () => {
        if (downloadUrl) {
          downloadFileFromUrl(downloadUrl);
        }
      },
      children: /* @__PURE__ */ jsx(FileDownloadIcon, {})
    }
  );
  const downloadButton = isMobile ? mobileDownloadButton : desktopDownloadButton;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-20 bg-paper border-b flex-shrink-0 text-sm min-h-50 px-10 text-muted", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 w-1/3 justify-start", children: [
      actionsLeft,
      allowDownload ? downloadButton : void 0
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-10 w-1/3 justify-center flex-nowrap text-main", children: [
      /* @__PURE__ */ jsx(
        FileThumbnail,
        {
          file: activeEntry,
          iconClassName: "w-16 h-16",
          showImage: false
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "whitespace-nowrap overflow-hidden overflow-ellipsis", children: activeEntry.name })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-1/3 flex items-center gap-10 justify-end whitespace-nowrap", children: [
      !isMobile && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(IconButton, { disabled: !onPrevious, onClick: onPrevious, children: /* @__PURE__ */ jsx(ChevronLeftIcon, {}) }),
        /* @__PURE__ */ jsx("div", { children: activeIndex + 1 }),
        /* @__PURE__ */ jsx("div", { children: "/" }),
        /* @__PURE__ */ jsx("div", { children: entries.length }),
        /* @__PURE__ */ jsx(IconButton, { disabled: !onNext, onClick: onNext, children: /* @__PURE__ */ jsx(ChevronRightIcon, {}) }),
        /* @__PURE__ */ jsx("div", { className: "bg-divider w-1 h-24 mx-20" })
      ] }),
      /* @__PURE__ */ jsx(IconButton, { radius: "rounded-none", onClick: onClose, children: /* @__PURE__ */ jsx(CloseIcon, {}) })
    ] })
  ] });
}
function FilePreviewDialog(props) {
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      size: "fullscreenTakeover",
      background: "bg-alt",
      className: "flex flex-col",
      children: /* @__PURE__ */ jsx(Content, { ...props })
    }
  );
}
function Content(props) {
  const { close } = useDialogContext();
  return /* @__PURE__ */ jsx(FilePreviewContainer, { onClose: close, ...props });
}
const FILE_ENTRY_TYPE_FILTER = {
  key: "type",
  label: message("Type"),
  description: message("Type of the file"),
  defaultOperator: FilterOperator.eq,
  control: {
    type: FilterControlType.Select,
    defaultValue: "05",
    options: [
      { key: "02", label: message("Text"), value: "text" },
      {
        key: "03",
        label: message("Audio"),
        value: "audio"
      },
      {
        key: "04",
        label: message("Video"),
        value: "video"
      },
      {
        key: "05",
        label: message("Image"),
        value: "image"
      },
      { key: "06", label: message("PDF"), value: "pdf" },
      {
        key: "07",
        label: message("Spreadsheet"),
        value: "spreadsheet"
      },
      {
        key: "08",
        label: message("Word Document"),
        value: "word"
      },
      {
        key: "09",
        label: message("Photoshop"),
        value: "photoshop"
      },
      {
        key: "10",
        label: message("Archive"),
        value: "archive"
      },
      {
        key: "11",
        label: message("Folder"),
        value: "folder"
      }
    ]
  }
};
const FILE_ENTRY_INDEX_FILTERS = [
  FILE_ENTRY_TYPE_FILTER,
  {
    key: "public",
    label: message("Visibility"),
    description: message("Whether file is publicly accessible"),
    defaultOperator: FilterOperator.eq,
    control: {
      type: FilterControlType.Select,
      defaultValue: "01",
      options: [
        { key: "01", label: message("Private"), value: false },
        { key: "02", label: message("Public"), value: true }
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
    key: "owner_id",
    label: message("Uploader"),
    description: message("User that this file was uploaded by"),
    defaultOperator: FilterOperator.eq,
    control: {
      type: FilterControlType.SelectModel,
      model: USER_MODEL
    }
  }
];
const ArrowBackIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" }),
  "ArrowBackOutlined"
);
const InfoIcon = createSvgIcon(
  /* @__PURE__ */ jsx("path", { d: "M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" }),
  "InfoOutlined"
);
export {
  activeInteraction as $,
  AddIcon as A,
  BackendFiltersUrlKey as B,
  ChipFieldFilterPanel as C,
  DashboardLayout as D,
  FILE_ENTRY_INDEX_FILTERS as E,
  FilterOperator as F,
  FilePreviewDialog as G,
  timestampFilter as H,
  InputFilterPanel as I,
  FormNormalizedModelField as J,
  KeyboardArrowRightIcon as K,
  LinkIcon as L,
  MoreVertIcon as M,
  NormalizedModelFilterPanel as N,
  ArrowBackIcon as O,
  FormattedNumber as P,
  InfoIcon as Q,
  useFileEntryUrls as R,
  SelectFilterPanel as S,
  Table as T,
  USER_MODEL as U,
  FileThumbnail as V,
  TableContext as W,
  FilePreviewContainer as X,
  FileEntryUrlsContext as Y,
  FILE_ENTRY_TYPE_FILTER as Z,
  DashboardLayoutContext as _,
  DashboardNavbar as a,
  isCtrlOrShiftPressed as a0,
  isCtrlKeyPressed as a1,
  dragMonitors as a2,
  DateRangeIcon as a3,
  FormattedDateTimeRange as a4,
  useDateRangePickerState as a5,
  DateRangeComparePresets as a6,
  DateRangeDialog as a7,
  DateRangePresets as a8,
  ArrowDownwardIcon as a9,
  ArrowRightAltIcon as aa,
  ChevronLeftIcon as ab,
  MenuOpenIcon as ac,
  DashboardSidenav as b,
  DashboardContent as c,
  FilterControlType as d,
  createdAtFilter as e,
  useBackendFilterUrlParams as f,
  DateRangeFilterPanel as g,
  FilterList as h,
  downloadFileFromUrl as i,
  FileDownloadIcon as j,
  Avatar as k,
  FormDatePicker as l,
  FormSwitch as m,
  ChipList as n,
  usePointerEvents as o,
  Switch as p,
  FormChipField as q,
  droppables as r,
  useDraggable as s,
  useDroppable as t,
  updatedAtFilter as u,
  updateRects as v,
  DeleteIcon as w,
  ChipField as x,
  useCurrentDateTime as y,
  useNormalizedModels as z
};
//# sourceMappingURL=Info-127d05d2.mjs.map
