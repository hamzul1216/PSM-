# Price Sensitivity Measurement (PSM) 
Price Sensitivity Measurement (PSM) Analysis made with typescript

## About this project
A simple TypeScript-based implementation of Price Sensitivity Measurement (PSM), a powerful tool used in pricing research to identify the optimal price point for products or services. The project demonstrates how to process consumer survey data to calculate key price points such as Highest Price, Compromise Price, Ideal Price, and Minimum Quality Price.

## Features
- Reads CSV input files containing consumer price survey data.
- Implements PSM analysis to identify key price sensitivity metrics:
  - Highest Price: The maximum price consumers are willing to pay before considering it too expensive.
  - Compromise Price: The price point where "too cheap" and "too expensive" rates intersect.
  - Ideal Price: The price point with the optimal balance between consumer affordability and perceived quality.
  - Minimum Quality Price: The lowest price point at which product quality is not doubted.

## How to Run

1. **Clone the repository**
   Clone this repository to your local machine and navigate to the project directory

2. **Install dependencies**
   install all the required dependencies using the following command:
   ```bash
   npm install
   ```
3. **Prepare the CSV file**
   Ensure you have a CSV file with the following required columns:
   - 高い (Expensive)
   - 安い (Cheap)
   - 高すぎる (Too Expensive)
   - 安すぎる (Too Cheap)

4. **Run the application **
   Execute the application by running the following command:
   ```bash
   ts-node index.ts --csvfile PSMrawdata.csv
   ```


# Price Sensitivity Measurement (PSM)   
TypeScriptを使用したPSM分析

## プロジェクトについて  
TypeScriptを用いたPSMのシンプルな実装です。PSMは、製品やサービスの最適な価格ポイントを特定するための強力なツールです。このプロジェクトでは、消費者調査データを処理して、最高価格、妥協価格、理想価格、最低品質価格などの主要な価格ポイントを計算する方法を示します。

## 特徴  
- 消費者価格調査データを含むCSV入力ファイルを読み取ります。
- 主要な価格感度指標を特定するためにPSM分析を実装します：
  - 最高価格: 消費者が「高すぎる」と感じる前に支払う意思のある最大価格。
  - 妥協価格: 「安すぎる」と「高すぎる」の評価が交差する価格ポイント。
  - 理想価格: 消費者の購入しやすさと製品の知覚品質とのバランスが最適な価格。
  - 最低品質価格: 消費者が製品の品質に疑問を抱かない最低価格ポイント。

## 実行方法  

1. **リポジトリをクローンする**  
   このリポジトリをローカルマシンにクローンし、プロジェクトディレクトリに移動します。  

2. **依存関係をインストールする**  
   以下のコマンドを使用して、必要な依存関係をすべてインストールします:  
   ```bash
   npm install
   ```

3. **CSVファイルを準備する**  
   以下の必要な列を含むCSVファイルを用意してください:  
   - 高い (Expensive)  
   - 安い (Cheap)  
   - 高すぎる (Too Expensive)  
   - 安すぎる (Too Cheap)  

4. **アプリケーションを実行する**  
   以下のコマンドを実行してアプリケーションを実行します:  
   ```bash
   ts-node index.ts --csvfile PSMrawdata.csv
   ```
