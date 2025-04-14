import logo from './assets/logo.svg'
import pixelSwapLogo from './assets/pixel-swap-log.png'
import './App.css'
import heroImage from './assets/image.png'
import sticker from './assets/sticker.webp'
import {GoShieldCheck, GoCode, GoRuby} from "react-icons/go";
import {useState} from 'react';

function tokenize(code: string): { type: string; content: string }[] {
    const patterns = {
        import: /\b(import)\b/,
        struct: /\b(struct)\b/,
        contract: /\b(contract)\b/,
        function: /\b(fun|inline fun|asm fun)\b/,
        keyword: /\b(const|let|var|if|else|for|while|do|switch|case|break|continue|class|interface|type|enum|export|default|from|as|extends|implements|new|this|super|try|catch|finally|throw|async|await|yield|void|null|undefined|return|require|get|receive|bounced|message|deploy|self|sender|myAddress|emptyAddress|beginCell|endCell|storeUint|storeAddress|storeBasechainAddress|storeMaybeRef|parseStdAddress|contractAddress|contractBasechainAddress|initOf|codeOf)\b/,
        type: /\b(Int|Bool|Address|Cell|StateInit|String|BasechainAddress)\b/,
        string: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/,
        number: /-?\b\d+\.?\d*\b/,
        boolean: /\b(true|false)\b/,
        comment: /\/\/.*/,
        operator: /[+\-*/%=<>!&|^~?:]+/,
        punctuation: /[{}[\]();,.]/,
        property: /\b(totalSupply|mintable|adminAddress|jettonContent|jettonWalletCode|owner|amount|receiver|ownerAddress|queryId|responseDestination|content|newOwner|value|bounce|mode|body|init|to|workchain|address|hash|includeAddress)\b/,
        parameter: /\b(msg|ctx|fwdFee|ownerWorkchain|targetJettonWallet|wallet|jettonWalletOwner)\b/
    };

    const tokens: { type: string; content: string }[] = [];
    let remaining = code;

    while (remaining) {
        let match: { type: string; content: string } | null = null;

        // Check for whitespace
        const whitespace = remaining.match(/^\s+/);
        if (whitespace) {
            tokens.push({type: 'text', content: whitespace[0]});
            remaining = remaining.slice(whitespace[0].length);
            continue;
        }

        // Check each pattern
        for (const [type, pattern] of Object.entries(patterns)) {
            const tokenMatch = remaining.match(pattern);
            if (tokenMatch && tokenMatch.index === 0) {
                match = {type, content: tokenMatch[0]};
                break;
            }
        }

        if (match) {
            tokens.push(match);
            remaining = remaining.slice(match.content.length);
        } else {
            // If no match found, treat the next character as plain text
            tokens.push({type: 'text', content: remaining[0]});
            remaining = remaining.slice(1);
        }
    }

    return tokens;
}

function ShowcaseCode({code, title, description}: { code: string, title?: string, description?: string }) {
    return (
        <div className="showcase-code">
            {(title || description) && (
                <div className="showcase-code-header">
                    {title && <div className="showcase-code-title">{title}</div>}
                    {description && <div className="showcase-code-description">{description}</div>}
                </div>
            )}
            <pre>
                <code>
                    {code.split('\n').map((line, index) => {
                        const tokens = tokenize(line);
                        return (
                            <div key={index} className="code-line">
                                <span className="line-number">{index + 1}</span>
                                <span className="line-content">
                                    {tokens.map((token, tokenIndex) => (
                                        <span
                                            key={tokenIndex}
                                            className={token.type !== 'text' ? `token-${token.type}` : undefined}
                                        >
                                            {token.content}
                                        </span>
                                    ))}
                                </span>
                            </div>
                        );
                    })}
                </code>
            </pre>
        </div>
    );
}

const FEATURES = [
    {
        id: 'syntax',
        title: 'TypeScript-like syntax',
        description: 'Write smart contracts with familiar TypeScript-like syntax that feels natural and easy to understand',
        code: `contract JettonMaster {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    
    init(owner: Address, mintable: Bool) {
        self.totalSupply = 0;
        self.mintable = mintable;
        self.owner = owner;
    }
}`,
        details: [
            {icon: '📝', text: 'Familiar syntax'},
            {icon: '🎯', text: 'Easy to learn'},
            {icon: '🔍', text: 'Clear and readable'}
        ]
    },
    {
        id: 'types',
        title: 'Strong type system',
        description: 'Built-in types for blockchain development with Structs, Messages, and maps support',
        code: `struct TokenTransfer {
    amount: Int;
    receiver: Address;
    customPayload: Cell;
}

message Transfer {
    amount: Int;
    to: Address;
    responseDestination: Address;
}

const transfers: map<Address, Int> = new Map();`,
        details: [
            {icon: '🛡️', text: 'Type-safe by default'},
            {icon: '📦', text: 'Built-in blockchain types'},
            {icon: '🗺️', text: 'First-class maps support'}
        ]
    },
    {
        id: 'routing',
        title: 'Message routing',
        description: 'Automatic routing of internal, external, and bounced messages with type checking',
        code: `receive(msg: Transfer) {
    require(msg.amount > 0, "Invalid amount");
    
    // Internal message handling
    send(SendParameters{
        to: msg.to,
        value: msg.amount,
        mode: SendRemainingValue
    });
}

receive("deposit") {
    // External message handling
}

bounced(msg: Slice) {
    // Bounced message handling
}`,
        details: [
            {icon: '🔄', text: 'Automatic routing'},
            {icon: '📨', text: 'Type-safe messages'},
            {icon: '🔙', text: 'Bounced handling'}
        ]
    },
    {
        id: 'messages',
        title: 'Message type handling',
        description: 'Automatic handling of different message types including binary, text, and fallback slices',
        code: `message TokenMint {
    amount: Int;
    receiver: Address;
}

receive(msg: TokenMint) {
    // Binary message
}

receive("text_command") {
    // Text message
}

fallback(msg: Slice) {
    // Fallback for unknown messages
}`,
        details: [
            {icon: '📝', text: 'Text messages'},
            {icon: '💻', text: 'Binary messages'},
            {icon: '🔄', text: 'Fallback handling'}
        ]
    },
    {
        id: 'maps',
        title: 'First-class maps',
        description: 'Powerful map support with convenient methods and foreach statement for traversing',
        code: `contract TokenRegistry {
    owners: map<Int, Address>;
    balances: map<Address, Int>;

    fun getBalance(owner: Address): Int {
        return this.balances.get(owner) ?? 0;
    }

    fun processBalances() {
        let total: Int = 0;
        this.balances.forEach((balance, owner) => {
            total = total + balance;
        });
    }
}`,
        details: [
            {icon: '🗺️', text: 'Native map type'},
            {icon: '🔄', text: 'Foreach support'},
            {icon: '⚡', text: 'Efficient storage'}
        ]
    },
    {
        id: 'asm',
        title: 'Low-level programming',
        description: 'Support for low-level programming with asm functions for maximum flexibility and optimization',
        code: `contract LowLevel {
    fun calculateHash(cell: Cell): Int {
        return asm(cell) {
            HASHCU // Calculate cell hash
            SWAP    // Swap stack values
            DROP    // Drop extra value
        };
    }
    
    asm fun fastMultiply(a: Int, b: Int): Int {
        MUL // Direct TVM multiplication
    };
}`,
        details: [
            {icon: '⚙️', text: 'Direct TVM access'},
            {icon: '🚀', text: 'Maximum performance'},
            {icon: '🔧', text: 'Low-level control'}
        ]
    }
];

const LEARNING_RESOURCES = [
    {
        id: 'docs',
        title: 'Documentation',
        description: 'Comprehensive documentation with guides, examples, and API reference',
        icon: '📚',
        link: '#',
        tags: ['Guides', 'API', 'Examples']
    },
    {
        id: 'playground',
        title: 'Playground',
        description: 'Interactive environment to write, test and deploy Tact contracts',
        icon: '🎮',
        link: '#',
        tags: ['Interactive', 'Testing', 'Deploy']
    },
    {
        id: 'kitchen',
        title: 'Tact Kitchen',
        description: 'Collection of ready-to-use smart contract templates and examples',
        icon: '👨‍🍳',
        link: '#',
        tags: ['Templates', 'Examples', 'Patterns']
    },
    {
        id: 'github',
        title: 'GitHub',
        description: 'Open source repository with compiler, tools and documentation',
        icon: '🐙',
        link: '#',
        tags: ['Source', 'Tools', 'Community']
    },
    {
        id: 'telegram',
        title: 'Telegram Community',
        description: 'Join our active community to get help and share knowledge',
        icon: '💬',
        link: '#',
        tags: ['Support', 'Discussion', 'Updates']
    },
    {
        id: 'tutorials',
        title: 'Video Tutorials',
        description: 'Step-by-step video guides for learning Tact development',
        icon: '🎥',
        link: '#',
        tags: ['Learning', 'Video', 'Guides']
    }
];

function App() {
    const [activeFeature, setActiveFeature] = useState(FEATURES[0].id);
    const currentFeature = FEATURES.find(f => f.id === activeFeature);

    return (
        <>
            <header>
                <div className="header-container">
                    <div className="logo">
                        <img src={logo} alt="Tact Logo"/>
                        <span>Tact</span>
                    </div>
                    <nav>
                        <ul>
                            <li><a href="#">Playground</a></li>
                            <li><a href="#">Documentation</a></li>
                            <li><a href="#">GitHub</a></li>
                            <li><a href="#">Telegram</a></li>
                            <li><a href="#">Tact Kitchen</a></li>
                            <li><a href="#">X.com</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main>
                <div className="first-page">
                    <div className="first-page-content">
                        <h1 className="first-page-title">
                            {/* <span>The</span> */}
                            <span className="gradient-text">Tact</span>
                            {/* <span>Programming Language</span> */}
                        </h1>

                        <div className="first-page-description">
                            Unleashing the power of TON with safe and scalable smart contracts
                        </div>

                        <div className="hero-image">
                            <img src={heroImage} alt="Hero Image"/>
                        </div>

                        <div className="cards">
                            <div className="card">
                                <div className="card-logo">
                                    <GoShieldCheck/>
                                </div>
                                <div className="card-title">
                                    <span>Secure by default</span>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-logo">
                                    <GoCode/>
                                </div>
                                <div className="card-title">
                                    <span>Intuitive by design</span>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-logo">
                                    <GoRuby/>
                                </div>
                                <div className="card-title">
                                    <span>Expressive by nature</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="second-page">
                    <div className="second-page-content">
                        <div className="second-page-image">
                            <img src={sticker} alt=""/>
                        </div>

                        <h2 className="second-page-title">
                            <span>Who uses <br/>Tact?</span>
                        </h2>

                        <div className="user-cards">
                            <div className="user-card user-card-proof-of-capital">
                                <div className="user-card-logo">
                                    <span>💰</span>
                                </div>
                                <div className="user-card-name">
                                    <span>Proof of Capital</span>
                                </div>
                                <div className="user-card-description">
                                    <span>A market-making smart contract that protects interests of all holders</span>
                                </div>
                            </div>

                            <div className="user-card user-card-tradoor">
                                <div className="user-card-logo">
                                    <svg width="69" height="56" viewBox="0 0 69 56" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M68.6641 5.79197C68.6641 3.77666 68.1355 1.82962 67.1569 0C64.0585 6.07324 56.4385 10.9559 46.6634 13.2197C43.4999 12.3076 39.3768 11.4829 34.5056 11.3546V11.3436C34.4486 11.3436 34.3917 11.3464 34.3348 11.3491C34.2779 11.3491 34.2209 11.3464 34.164 11.3436V11.3546C29.2927 11.4856 25.1696 12.3103 22.0061 13.2197C12.2283 10.9531 4.60833 6.07324 1.50991 0C0.528603 1.83235 0 3.77666 0 5.79197C0 13.3289 7.37604 19.8746 18.2138 23.187C20.4447 33.5476 22.6757 43.9081 24.904 54.2687C27.1377 54.9951 30.3066 55.7815 34.1613 55.9836V56.0027C34.2182 56.0027 34.2751 55.9973 34.3321 55.9945C34.389 55.9973 34.4459 56 34.5028 56.0027V55.9836C38.3549 55.7815 41.5265 54.9951 43.7602 54.2687C45.9911 43.9081 48.2221 33.5476 50.4504 23.1897C61.2854 19.8773 68.6641 13.3316 68.6641 5.7947V5.79197Z"
                                            fill="white"></path>
                                    </svg>
                                </div>
                                <div className="user-card-name">
                                    <span>Tradoor</span>
                                </div>
                                <div className="user-card-description">
                                    <span>Fast and social DEX on TON</span>
                                </div>
                            </div>


                            <div className="user-card user-card-pixel-swap">
                                <div className="user-card-logo">
                                    <img src={pixelSwapLogo} alt="Pixel Swap Logo"/>
                                </div>
                                <div className="user-card-name">
                                    <span>Pixel Swap</span>
                                </div>
                                <div className="user-card-description">
                                    <span>First modular and upgradeable DEX on TON</span>
                                </div>
                            </div>

                            <div className="user-card user-card-gas-pump">
                                <div className="user-card-logo">
                                    <span>⛽</span>
                                </div>
                                <div className="user-card-name">
                                    <span>GasPump</span>
                                </div>
                                <div className="user-card-description">
                                    <span>TON memecoin launchpad and trading platform</span>
                                </div>
                            </div>
                        </div>

                        <div className="second-page-description">
                            <p>As of the beginning of 2025, nearly 28,000 unique smart contracts were live on the
                                TON mainnet. About a third were written in Tact, reflecting its increasing adoption
                                among
                                developers.
                            </p>

                            {/*<div className="progress-bar">*/}
                            {/*    <div className="progress-bar-fill"></div>*/}
                            {/*    <div className="progress-bar-label">*/}
                            {/*        <span>33%</span>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*<p>Here are some selected Tact-based software and applications deployed in production and consumed by end users:</p>*/}
                        </div>


                    </div>
                </div>

                <div className="third-page">
                    <div className="third-page-content">
                        {/* <div className="third-page-image">
                            <img src={sticker2} alt="Sticker 2"/>
                        </div> */}

                        <h2 className="third-page-title">
                            <span>Key &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Features</span>
                        </h2>

                        <div className="third-page-features">
                            <div className="features-list">
                                {FEATURES.map(feature => (
                                    <div
                                        key={feature.id}
                                        className={`feature-item ${activeFeature === feature.id ? 'active' : ''}`}
                                        onClick={() => setActiveFeature(feature.id)}
                                    >
                                        {feature.title}
                                    </div>
                                ))}
                            </div>
                            <div className="feature-info">
                                <div className="feature-info-header">
                                    <div className="feature-info-title">
                                        {currentFeature?.title}
                                    </div>
                                    <div className="feature-info-description">
                                        {currentFeature?.description}
                                    </div>
                                </div>

                                <div className="feature-info-details">
                                    {currentFeature?.details.map((detail, index) => (
                                        <div key={index} className="feature-detail-item">
                                            <span className="feature-detail-icon">{detail.icon}</span>
                                            <span className="feature-detail-text">{detail.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <ShowcaseCode
                                    code={currentFeature?.code || ''}
                                    title="Example"
                                    description="Try it in the playground"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fourth-page">
                    <div className="fourth-page-content">
                        <h2 className="fourth-page-title">
                            Learning Resources
                        </h2>
                        <div className="fourth-page-description">
                            Everything you need to start building with Tact
                        </div>

                        <div className="resources-grid">
                            {LEARNING_RESOURCES.map(resource => (
                                <a key={resource.id} href={resource.link} className="resource-card">
                                    <div className="resource-icon">{resource.icon}</div>
                                    <div className="resource-content">
                                        <div className="resource-title">{resource.title}</div>
                                        <div className="resource-description">{resource.description}</div>
                                        <div className="resource-tags">
                                            {resource.tags.map(tag => (
                                                <span key={tag} className="resource-tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                <div className="footer-content">
                    <div className="footer-main">
                        <div className="footer-sponsored">
                            <span>Sponsored by</span>
                            <div className="ton-foundation">
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M9.83855 12.0186L13.8648 5.4896C14.9707 3.69621 15.5237 2.79952 15.4611 2.06026C15.4066 1.4158 15.0773 0.825974 14.5574 0.441281C13.961 0 12.9075 0 10.8006 0H5.19949C3.09253 0 2.03904 0 1.44265 0.441281C0.92273 0.825974 0.593499 1.4158 0.538957 2.06026C0.476393 2.79952 1.02936 3.69621 2.13528 5.4896L6.1615 12.0186C6.77009 13.0055 7.07439 13.499 7.46527 13.6676C7.80657 13.8148 8.19348 13.8148 8.53478 13.6676C8.92566 13.499 9.22996 13.0055 9.83855 12.0186ZM7.20003 1.60003V10.6499L2.62126 3.18373C2.30384 2.66615 2.14514 2.40736 2.16356 2.1941C2.17962 2.00817 2.27481 1.83811 2.42491 1.72722C2.59709 1.60003 2.90066 1.60003 3.50782 1.60003H7.20003ZM8.80003 10.65V1.5999H12.4923C13.0994 1.5999 13.403 1.5999 13.5752 1.7271C13.7253 1.83799 13.8205 2.00804 13.8365 2.19397C13.8549 2.40723 13.6962 2.66601 13.3788 3.18358L8.80003 10.65Z"
                                          fill="#99A1AD"></path>
                                </svg>
                                <span>TON Foundation</span>
                            </div>
                        </div>
                        <div className="footer-links">
                            <div className="footer-section">
                                <h4>Resources</h4>
                                <ul>
                                    <li><a href="#">Documentation</a></li>
                                    <li><a href="#">Playground</a></li>
                                    <li><a href="#">Tact Kitchen</a></li>
                                    <li><a href="#">Examples</a></li>
                                </ul>
                            </div>
                            <div className="footer-section">
                                <h4>Community</h4>
                                <ul>
                                    <li><a href="#">GitHub</a></li>
                                    <li><a href="#">Telegram</a></li>
                                    <li><a href="#">X.com</a></li>
                                    <li><a href="#">Blog</a></li>
                                </ul>
                            </div>
                            <div className="footer-section">
                                <h4>Support</h4>
                                <ul>
                                    <li><a href="#">FAQ</a></li>
                                    <li><a href="#">Report Issue</a></li>
                                    <li><a href="#">Contact</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            © 2025 Tact Language. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default App
