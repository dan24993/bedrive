import clsx from 'clsx';
import {LandingPageContent} from './landing-page-content';
import {Navbar} from '@common/ui/navigation/navbar/navbar';
import {Button, ButtonProps} from '@common/ui/buttons/button';
import {IconButton} from '@common/ui/buttons/icon-button';
import {KeyboardArrowDownIcon} from '@common/icons/material/KeyboardArrowDown';
import {MixedImage} from '@common/ui/images/mixed-image';
import {Footer} from '@common/ui/footer/footer';
import {Trans} from '@common/i18n/trans';
import {AdHost} from '@common/admin/ads/ad-host';
import {Link} from 'react-router-dom';
import {createSvgIconFromTree} from '@common/icons/create-svg-icon';
import {MenuItemConfig} from '@common/core/settings/settings';
import {Fragment} from 'react';
import {DefaultMetaTags} from '@common/seo/default-meta-tags';
import {useTrans} from '@common/i18n/use-trans';
import {useSettings} from '@common/core/settings/use-settings';

interface ContentProps {
  content: LandingPageContent;
}
export function LandingPage() {
  const settings = useSettings();
  const homepage = settings.homepage as {appearance: LandingPageContent};

  return (
    <Fragment>
      <DefaultMetaTags />
      <div>
        <HeroHeader content={homepage.appearance} />
        <AdHost slot="landing-top" className="mb-14 px-14 md:mb-60" />
        <PrimaryFeatures content={homepage.appearance} />
        <div className="my-40 h-1 bg-divider" />
        <SecondaryFeatures content={homepage.appearance} />
        <BottomCta content={homepage.appearance} />
        <Footer className="landing-container" />
      </div>
    </Fragment>
  );
}

function HeroHeader({
  content: {
    headerTitle,
    headerSubtitle,
    headerImage,
    headerImageOpacity,
    actions,
    headerOverlayColor1,
    headerOverlayColor2,
  },
}: ContentProps) {
  const {trans} = useTrans();

  let overlayBackground = undefined;

  if (headerOverlayColor1 && headerOverlayColor2) {
    overlayBackground = `linear-gradient(45deg, ${headerOverlayColor1} 0%, ${headerOverlayColor2} 100%)`;
  } else if (headerOverlayColor1) {
    overlayBackground = headerOverlayColor1;
  } else if (headerOverlayColor2) {
    overlayBackground = headerOverlayColor2;
  }

  return (
    <header
      className="relative mb-14 h-500 md:mb-60 md:h-screen"
      style={{background: overlayBackground}}
    >
      <div
        data-testid="headerImage"
        className="absolute inset-0 z-10 bg-cover bg-1/2 bg-no-repeat md:bg-fixed"
        style={{
          backgroundImage: `url(${headerImage})`,
          opacity: headerImageOpacity,
        }}
      />
      <div className="relative z-20 flex h-full flex-col">
        <Navbar
          color="transparent"
          className="flex-shrink-0"
          menuPosition="homepage-navbar"
        />
        <div className="mx-auto flex max-w-850 flex-auto flex-col items-center justify-center px-14 text-center text-white">
          {headerTitle && (
            <h1
              className="text-4xl font-medium md:text-5xl"
              data-testid="headerTitle"
            >
              <Trans message={headerTitle} />
            </h1>
          )}
          {headerSubtitle && (
            <div
              className="mt-30 text-lg md:mt-10 md:text-xl"
              data-testid="headerSubtitle"
            >
              <Trans message={headerSubtitle} />
            </div>
          )}
          <div className="mt-30 flex min-h-50 gap-20">
            <CtaButton
              item={actions?.cta1}
              variant="raised"
              color="primary"
              size="lg"
              radius="rounded-full"
              data-testid="cta1"
              className="min-w-180"
            />
            <CtaButton
              item={actions?.cta2}
              variant="text"
              color="paper"
              size="lg"
              radius="rounded-full"
              data-testid="cta2"
            />
          </div>
        </div>
      </div>
      <IconButton
        size="lg"
        className="absolute bottom-5 left-0 right-0 z-30 mx-auto text-white max-md:hidden"
        elementType="a"
        aria-label={trans({message: 'View features'})}
        href="#primary-features"
      >
        <KeyboardArrowDownIcon />
      </IconButton>
    </header>
  );
}

interface CtaButtonProps extends ButtonProps {
  item?: MenuItemConfig;
}
function CtaButton({item, ...buttonProps}: CtaButtonProps) {
  if (!item?.label) return null;
  const Icon = item.icon ? createSvgIconFromTree(item.icon) : undefined;
  return (
    <Button
      elementType={item.type === 'route' ? Link : 'a'}
      href={item.action}
      to={item.action}
      startIcon={Icon ? <Icon /> : undefined}
      {...buttonProps}
    >
      <Trans message={item.label} />
    </Button>
  );
}

function PrimaryFeatures({content}: ContentProps) {
  return (
    <div
      className="landing-container items-stretch gap-26 md:flex"
      id="primary-features"
    >
      {content?.primaryFeatures?.map((feature, index) => (
        <div
          key={index}
          className="mb-14 flex-1 rounded-2xl px-24 py-36 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:mb-0"
          data-testid={`primary-root-${index}`}
        >
          <MixedImage
            className="mx-auto mb-30 h-128"
            data-testid={`primary-image-${index}`}
            src={feature.image}
          />
          <h2
            className="my-16 text-lg font-medium"
            data-testid={`primary-title-${index}`}
          >
            <Trans message={feature.title} />
          </h2>
          <div
            className="text-md text-[0.938rem]"
            data-testid={`primary-subtitle-${index}`}
          >
            <Trans message={feature.subtitle} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SecondaryFeatures({content}: ContentProps) {
  return (
    <div className="landing-container">
      {content?.secondaryFeatures?.map((feature, index) => {
        const isEven = index % 2 === 0;
        return (
          <div
            key={index}
            data-testid={`secondary-root-${index}`}
            className={clsx(
              'mb-14 py-16 md:mb-80 md:flex',
              isEven && 'flex-row-reverse',
            )}
          >
            <img
              src={feature.image}
              className="mr-auto w-580 max-w-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
              data-testid={`secondary-image-${index}`}
              alt=""
            />
            <div className="ml-30 mr-auto max-w-350 pt-30">
              <small
                className="mb-16 text-xs font-medium uppercase tracking-widest text-muted"
                data-testid={`secondary-subtitle-${index}`}
              >
                <Trans message={feature.subtitle} />
              </small>
              <h3
                className="py-16 text-3xl"
                data-testid={`secondary-title-${index}`}
              >
                <Trans message={feature.title} />
              </h3>
              <div className="h-2 w-50 bg-black/90" />
              <div
                className="my-20 text-[0.938rem]"
                data-testid={`secondary-description-${index}`}
              >
                <Trans message={feature.description} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BottomCta({content}: ContentProps) {
  return (
    <div
      className="relative bg-[#2B2B2B] bg-no-repeat py-70 text-center text-on-primary md:bg-fixed"
      style={{backgroundImage: `url("${content.footerImage}")`}}
      data-testid="footerImage"
    >
      <h2
        className="mx-auto max-w-620 text-3xl font-normal"
        data-testid="footerTitle"
      >
        <Trans message={content.footerTitle} />
      </h2>
      {content.footerSubtitle && (
        <p
          className="mx-auto mt-50 max-w-620 text-2xl font-normal"
          data-testid="footerSubtitle"
        >
          <Trans message={content.footerSubtitle} />
        </p>
      )}
      <CtaButton
        item={content.actions?.cta3}
        size="lg"
        variant="outline"
        color="paper"
        className="mt-50 block"
        data-testid="cta3"
      />
    </div>
  );
}
