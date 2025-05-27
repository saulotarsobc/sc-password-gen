import { useEffect, useState } from "react";

const MORE_LIMIT = 24;
const LESS_LIMIT = 8;
const INTERVAL = 22;

type CharType = "upper" | "lower" | "number" | "special";

const Home = () => {
  const [size, setSize] = useState<number>(LESS_LIMIT);
  const [password, setPassword] = useState<string>("");
  const [securityLevel, setSecurityLevel] = useState<number>(0);

  const [types, setTypes] = useState<Record<CharType, boolean>>({
    upper: true,
    lower: true,
    number: true,
    special: false,
  });

  // Tocar som ao clicar
  const playKeySound = () => {
    const audio = new Audio("/sounds/key_sound.wav");
    audio.volume = 1;
    audio.play().catch((e) => {
      console.warn("Falha ao tocar áudio:", e);
    });
  };
  useEffect(() => {
    playKeySound();
    updateSecurityLevel();
  }, []);

  useEffect(() => {
    updateSecurityLevel();
  }, [size, types]);

  const getRandomChar = (type: CharType): string => {
    const maps: Record<CharType, string> = {
      upper: "ABCDEFGHIJCLMNOPQRSTUVXYZ",
      lower: "abcdefghijklmnopqrstuvxyz",
      number: "1234567890",
      special: "!@#$%<>&*()_+{}[]",
    };
    const chars = maps[type];
    return chars[Math.floor(Math.random() * chars.length)];
  };

  const shuffleArray = (array: string[]): string[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const updateSecurityLevel = () => {
    let level = 12 + size * 2;
    if (types.upper) level += 11;
    if (types.lower) level += 11;
    if (types.number) level += 8;
    if (types.special) level += 14;

    if (
      !types.upper &&
      !types.lower &&
      types.number &&
      !types.special &&
      size < 12
    ) {
      level = 10 + size;
    }

    if (level >= 88) level = 100;

    setSecurityLevel(level);
  };

  const handleSizeChange = (action: "more" | "less") => {
    playKeySound();
    if (action === "more" && size < MORE_LIMIT) {
      setSize((prev) => prev + 1);
    }
    if (action === "less" && size > LESS_LIMIT) {
      setSize((prev) => prev - 1);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setTypes((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const generatePassword = () => {
    playKeySound();

    if (!Object.values(types).some((val) => val)) {
      setTypes((prev) => ({
        ...prev,
        upper: true,
        lower: true,
      }));
      return;
    }

    let newPass: string[] = [];
    let count = 0;

    while (count < size) {
      (Object.keys(types) as CharType[]).forEach((type) => {
        if (types[type] && count < size) {
          newPass.push(getRandomChar(type));
          count++;
        }
      });
    }

    newPass = shuffleArray(newPass);
    setPassword("");

    newPass.forEach((char, i) => {
      setTimeout(() => {
        setPassword((prev) => prev + char);
      }, INTERVAL * i);
    });
  };

  const copyToClipboard = () => {
    playKeySound();
    navigator.clipboard.writeText(password);
    alert("Senha copiada: " + password);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code;

      if (["F12", "Tab"].includes(key)) return;

      e.preventDefault();

      const actions: Record<string, () => void> = {
        ArrowUp: () => handleSizeChange("more"),
        ArrowDown: () => handleSizeChange("less"),
        KeyM: () => document.getElementById("upper")?.click(),
        KeyI: () => document.getElementById("lower")?.click(),
        KeyN: () => document.getElementById("number")?.click(),
        KeyE: () => document.getElementById("special")?.click(),
        KeyG: generatePassword,
        KeyC: copyToClipboard,
      };

      if (actions[key]) actions[key]();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [types, size]);

  return (
    <main>
      <div id="wrap">
        <div id="wrap_pass">
          <div id="pass_icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="white"
            >
              <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zm40-176c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z" />
            </svg>
          </div>
          <div id="wrap_security_level">
            <div
              id="safe_bar"
              style={{
                width: `${securityLevel}%`,
                background:
                  securityLevel >= 88
                    ? "#4fff5e"
                    : securityLevel >= 51
                    ? "#edff4f"
                    : securityLevel >= 40
                    ? "#ff933b"
                    : "#ff4d4d",
              }}
            />
          </div>
          <pre id="pass">{password}</pre>
        </div>

        <div id="configs">
          <div id="size_wrap">
            <div id="controls">
              <button id="more" onClick={() => handleSizeChange("more")}>
                +
              </button>
              <button id="less" onClick={() => handleSizeChange("less")}>
                -
              </button>
            </div>
            <input value={size} id="size" type="text" disabled />
          </div>

          <div id="types">
            {(["upper", "lower", "number", "special"] as CharType[]).map(
              (type) => (
                <div className="wrap_type" key={type}>
                  <input
                    type="checkbox"
                    className="type"
                    id={type}
                    checked={types[type]}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={type}>
                    {type === "upper" && (
                      <>
                        <u>M</u>aiúscula
                      </>
                    )}
                    {type === "lower" && (
                      <>
                        M<u>i</u>núscula
                      </>
                    )}
                    {type === "number" && (
                      <>
                        <u>N</u>úmeros
                      </>
                    )}
                    {type === "special" && (
                      <>
                        <u>E</u>speciais
                      </>
                    )}
                  </label>
                </div>
              )
            )}
          </div>
        </div>

        <div id="btns">
          <button className="btn" id="gerar" onClick={generatePassword}>
            <u>G</u>erar Senha
          </button>
          <button className="btn" id="copiar" onClick={copyToClipboard}>
            <u>C</u>opiar
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
