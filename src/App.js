import './App.css';
import SliderComponent from "./components/SliderComponent";
import {DatePicker} from "antd";
import {useState} from "react";
import dayjs from "dayjs";


const {RangePicker} = DatePicker

function App() {
    const [dates, setDates] = useState([])
    const [selectedDates, setSelectedDates] = useState([])
    const [switcher, setSwitcher] = useState(true)
    // Инициализация состояний максимальной-минимальной и выбранных дат, а так же значения switcher, которое регулирует режимы
    // "все года" или "месяца"

    function disabledDateFirst(current) {
        let startDate = dates[0]
        let endDate = dayjs(dates[0]).add(2, "year")
        return current < startDate || current > endDate
    }

    // Ограничения на выбор максимальной-минимальной даты. Не больше двух лет от минимальной даты


    function disabledDateSecond(current) {
        let startDate = dates[0]
        let endDate = dates[1]
        return current < startDate || current > endDate
    }

    // Ограничения на выбор дат для промежутка. Значения должны находится в границах максимальной-минимальной даты

    const onClickYears = () => {
        setSwitcher(true)
    }
    const onClickMonths = () => {
        setSwitcher(false)
    }
    // Колбеки для переключения режимов

    return (
        <main className={"slider__main"}>
            <div className="slider__container">
                <div className={"slider__dates"}>
                    <div className={"slider__dates-left"}>
                        <RangePicker disabledDate={disabledDateFirst}
                                     onChange={(values) => {
                                         setDates(values)
                                     }} allowClear={false} value={dates}/>
                        <div className={"slider__dates-text"}>Задайте максимальную и минимальную дату</div>
                        <div/>
                    </div>
                    <div className={"slider__dates-right"}>
                        <RangePicker disabledDate={disabledDateSecond} onChange={(values) => {
                            setSelectedDates(values)
                        }} allowClear={false} value={selectedDates}/>
                        <div className={"slider__dates-text"}>Укажите даты желаемого промежутка</div>
                    </div>
                </div>

                <div className={"slider__wrapper"}>
                    <div className={"slider__switchers"}>
                        <p className={switcher ? "slider__switcher-active" : "slider__switcher"}
                           onClick={onClickYears}>Все года</p>
                        <p className={switcher ? "slider__switcher" : "slider__switcher-active"}
                           onClick={onClickMonths}>Месяца</p>
                    </div>

                    <SliderComponent dates={dates === null ? '' : dates}
                                     selectedDates={selectedDates === null ? '' : selectedDates}
                                     switcher={switcher}/>
                </div>
            </div>
        </main>
    );
}

export default App;
