
document.getElementById("demo").innerHTML = add(8)

function add(num) {
	return num + 2
}

async function main() {
	let pyodide = await loadPyodide();

	await pyodide.loadPackage("micropip");
	const micropip = pyodide.pyimport("micropip");

	let prices = await (await fetch("http://127.0.0.1:8005/resources/prices.csv")).text();
	//let amzn_data = await fetch("http://127.0.0.1:8009/resources/amzn_data.csv");
	//let pythonCode = await (await fetch("http://127.0.0.1:8000/scripts/test.py")).text();

	await micropip.install(["pandas", "altair"]);

	//console.log(
	//	pyodide.runPython(`
	//	import pandas as pd
	//	x = [2, 5, 6]
	//	y = [10, 3, 15]
	//	df = pd.DataFrame(data=[x, y])
	//	print(df)
	//	`)
	//);
	//
	//console.log(amzn_data);
	
	//console.log(
	//	pyodide.runPython(`
	//		from pathlib import Path

	//		Path("/hello.txt").write_text("hello world!")
	//	`)
	//);

	//let file = pyodide.FS.readFile("/hello.txt", { encoding: "utf8" });
	//console.log(file); // ==> "hello world!"

	let data = prices;
	//print(Path("/amzn.txt").read_text())
	pyodide.FS.writeFile("/prices.csv", data, { encoding: "utf8" });
	pyodide.FS.writeFile("./resources/chart.json", data, { encoding: "utf8" });

	pyodide.runPython(`
		import pandas as pd
		import altair as alt
		from pathlib import Path
		df = pd.read_csv(Path("/prices.csv"))
		print(df)

		print(dir(alt.Chart))
		print(dir(alt.Chart(df)))
		chart = alt.Chart(df).mark_point()
		print(chart.to_json)
		chart_save_path = Path(r"./resources/chart.json")
		with open(chart_save_path, 'w') as f:
			f.write(chart.to_json())
		print(chart_save_path.exists())
		print(f.closed)
		`);
}

document.getElementById("dt").innerHTML = main();


