// TODO: Decide if fallback process change be changed so this component doesn't
// have to know about `context.intl` to make sure a `locale` is specified on its
// internal <IntlProvider>.

import React, {PropTypes} from 'react';
import {
    FormattedMessage,
    FormattedNumber,
    FormattedRelative,
    IntlProvider,
    defineMessages,
    intlShape,
} from 'react-intl';

const messages = defineMessages({
    welcome: {
        id: 'greeting.welcome',
        defaultMessage: `
            Welcome {name}, you have received {unreadCount, plural,
                =0 {no new messages}
                one {{formattedUnreadCount} new message}
                other {{formattedUnreadCount} new messages}
            }.
        `,
    },

    last_login: {
        id: 'greeting.last_login',
        defaultMessage: 'You logged in {formattedLastLoginTime}.',
    },
});

const en_messages = Object.keys(messages).reduce((en, messageName) => {
    let {id, defaultMessage} = messages[messageName];
    en[id] = defaultMessage.trim();
    return en;
}, {});

const Greeting = (
    {name, unreadCount, lastLoginTime, locale, translations}, // props
    {intl = {}} // context
) => (
    <IntlProvider
        locale={locale || intl.locale || 'en'}
        messages={translations}
        defaultLocale="en"
    >
        <p>
            <FormattedMessage
                {...messages.welcome}
                values={{
                    name: <b>{name}</b>,
                    unreadCount: unreadCount,
                    formattedUnreadCount: (
                        <b><FormattedNumber value={unreadCount} /></b>
                    ),
                }}
            />
            {" "}
            {isFinite(lastLoginTime) ? (
                <FormattedMessage
                    {...messages.last_login}
                    values={{
                        formattedLastLoginTime: (
                            <FormattedRelative
                                value={lastLoginTime}
                                updateInterval={1000}
                            />
                        ),
                    }}
                />
            ) : null}
        </p>
    </IntlProvider>
);

Greeting.propTypes = {
    name         : PropTypes.node.isRequired,
    unreadCount  : PropTypes.number.isRequired,
    lastLoginTime: PropTypes.any,
    locale       : PropTypes.string,
    translations : PropTypes.object,
};

Greeting.defaultProps = {
    translations: en_messages,
};

// Opt-in to `context.intl` in case we're nested inside another <IntlProvider>.
// This way we can fallback to its `locale` value if one isn't on `props`.
Greeting.contextTypes = {
    intl: intlShape,
};

export default Greeting;
