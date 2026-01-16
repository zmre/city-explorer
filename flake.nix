{
  description = "City Desirability Explorer";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};

      # Build the static site
      city-explorer = pkgs.stdenv.mkDerivation {
        pname = "city-explorer";
        version = "0.1.0";
        src = self;

        nativeBuildInputs = [pkgs.bun pkgs.nodejs_22];

        buildPhase = ''
          cd web
          export HOME=$TMPDIR
          bun install --frozen-lockfile
          bun run build
        '';

        installPhase = ''
          mkdir -p $out
          cp -r build/* $out/
        '';
      };

      # Script to run the dev server (runs from current working directory)
      run-dev = pkgs.writeShellScriptBin "city-explorer-dev" ''
        # Find web directory - check if we're in it or need to cd into it
        if [ -f "package.json" ] && grep -q "vite" package.json 2>/dev/null; then
          WEB_DIR="."
        elif [ -d "web" ] && [ -f "web/package.json" ]; then
          WEB_DIR="web"
        else
          echo "Error: Cannot find web directory. Run from project root or web/ directory."
          exit 1
        fi

        cd "$WEB_DIR"
        ${pkgs.bun}/bin/bun install --frozen-lockfile
        ${pkgs.bun}/bin/bun run dev
      '';
    in rec {
      packages = {
        default = city-explorer;
        static = city-explorer;
        dev = run-dev;
      };

      apps = {
        default = {
          type = "app";
          program = "${run-dev}/bin/city-explorer-dev";
        };
      };

      devShell = pkgs.mkShell {
        buildInputs = with pkgs.nodePackages; [
          pkgs.nodejs_22
          pkgs.autoconf
          pkgs.mozjpeg
          pkgs.libtool
          pkgs.automake
          pkgs.nasm
          pkgs.libpng
          pkgs.optipng
          pkgs.pkg-config
          pkgs.gcc
          pkgs.dpkg
          pkgs.playwright-test
          pkgs.playwright-driver
          pkgs.fabric-ai
          pkgs.imagemagick
          pkgs.bun
          (pkgs.yarn-berry.override {nodejs = pkgs.nodejs_22;})
          typescript
          typescript-language-server
          diagnostic-languageserver
          eslint_d
        ];
      };
    });
}
